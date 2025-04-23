const db = require('../config/db');

// Tạo bài kiểm tra cho chương
exports.createExam = async (req, res) => {
  try {
    const { chapter_id, time_limit = 30, total_questions = 10 } = req.body;
    
    // Kiểm tra chương tồn tại
    const [chapters] = await db.query('SELECT c.*, co.id as course_id FROM chapters c JOIN courses co ON c.course_id = co.id WHERE c.id = ?', [chapter_id]);
    
    if (chapters.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Chương không tồn tại'
      });
    }
    
    const chapter = chapters[0];
    
    // Kiểm tra bài kiểm tra đã tồn tại cho chương này chưa
    const [existingExams] = await db.query('SELECT * FROM exams WHERE chapter_id = ?', [chapter_id]);
    
    if (existingExams.length > 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Bài kiểm tra đã tồn tại',
        data: {
          exam: existingExams[0]
        }
      });
    }
    
    // Tạo bài kiểm tra mới
    const [result] = await db.query(`
      INSERT INTO exams 
      (course_id, chapter_id, title, time_limit, total_questions)
      VALUES (?, ?, ?, ?, ?)
    `, [
      chapter.course_id,
      chapter_id,
      `Kiểm tra chương: ${chapter.title}`,
      time_limit,
      total_questions
    ]);
    
    // Lấy thông tin bài kiểm tra vừa tạo
    const [newExam] = await db.query('SELECT * FROM exams WHERE id = ?', [result.insertId]);
    
    return res.status(201).json({
      status: 'success',
      message: 'Tạo bài kiểm tra thành công',
      data: {
        exam: newExam[0]
      }
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi tạo bài kiểm tra',
      error: error.message
    });
  }
};

// Lấy thông tin bài kiểm tra theo chapter_id
exports.getExamByChapter = async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    
    // Kiểm tra chương tồn tại
    const [chapters] = await db.query('SELECT * FROM chapters WHERE id = ?', [chapterId]);
    
    if (chapters.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Chương không tồn tại'
      });
    }
    
    // Lấy thông tin bài kiểm tra
    const [exams] = await db.query(`
      SELECT e.*, c.title as chapter_title, co.title as course_title
      FROM exams e
      JOIN chapters c ON e.chapter_id = c.id
      JOIN courses co ON e.course_id = co.id
      WHERE e.chapter_id = ?
    `, [chapterId]);
    
    if (exams.length === 0) {
      // Nếu chưa có bài kiểm tra, tự động tạo mới
      const [createResult] = await db.query(`
        INSERT INTO exams 
        (course_id, chapter_id, title, time_limit, total_questions)
        VALUES (?, ?, ?, ?, ?)
      `, [
        chapters[0].course_id,
        chapterId,
        `Kiểm tra chương: ${chapters[0].title}`,
        30, // Default time limit: 30 phút
        10  // Default total questions: 10 câu hỏi
      ]);
      
      const [newExam] = await db.query(`
        SELECT e.*, c.title as chapter_title, co.title as course_title
        FROM exams e
        JOIN chapters c ON e.chapter_id = c.id
        JOIN courses co ON e.course_id = co.id
        WHERE e.id = ?
      `, [createResult.insertId]);
      
      return res.status(201).json({
        status: 'success',
        message: 'Bài kiểm tra được tạo tự động',
        data: {
          exam: newExam[0]
        }
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        exam: exams[0]
      }
    });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi lấy thông tin bài kiểm tra',
      error: error.message
    });
  }
};

// Bắt đầu làm bài kiểm tra
exports.startExam = async (req, res) => {
  try {
    const { exam_id } = req.body;
    const user_id = req.user.id;
    
    // Kiểm tra bài kiểm tra tồn tại
    const [exams] = await db.query('SELECT * FROM exams WHERE id = ?', [exam_id]);
    
    if (exams.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Bài kiểm tra không tồn tại'
      });
    }
    
    const exam = exams[0];
    
    // Kiểm tra số lượng câu hỏi cho chương
    const [questionCount] = await db.query('SELECT COUNT(*) as count FROM questions WHERE chapter_id = ?', [exam.chapter_id]);
    
    if (questionCount[0].count < exam.total_questions) {
      return res.status(400).json({
        status: 'error',
        message: `Không đủ câu hỏi cho bài kiểm tra. Cần ${exam.total_questions} câu hỏi nhưng chỉ có ${questionCount[0].count} câu hỏi.`
      });
    }
    
    // Tạo một user_exam mới
    const [result] = await db.query(`
      INSERT INTO user_exam 
      (exam_id, user_id, attempt_count, score)
      VALUES (?, ?, ?, ?)
    `, [exam_id, user_id, 1, 0]);
    
    const userExamId = result.insertId;
    
    // Lấy ngẫu nhiên câu hỏi cho bài kiểm tra
    const [questions] = await db.query(`
      SELECT * FROM questions 
      WHERE chapter_id = ? 
      ORDER BY RAND() 
      LIMIT ?
    `, [exam.chapter_id, exam.total_questions]);
    
    // Tạo các liên kết question_test
    for (const question of questions) {
      await db.query(`
        INSERT INTO question_test
        (question_id, user_exam_id)
        VALUES (?, ?)
      `, [question.id, userExamId]);
    }
    
    // Lấy thông tin user_exam vừa tạo
    const [userExam] = await db.query(`
      SELECT * FROM user_exam 
      WHERE id = ?
    `, [userExamId]);
    
    // Lấy các câu hỏi đã chọn cho bài kiểm tra này
    const [selectedQuestions] = await db.query(`
      SELECT q.* 
      FROM questions q
      JOIN question_test qt ON q.id = qt.question_id
      WHERE qt.user_exam_id = ?
    `, [userExamId]);
    
    // Format lại câu hỏi để gửi về cho client (không bao gồm đáp án đúng)
    const formattedQuestions = selectedQuestions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: [
        { key: 'A', text: q.option_a },
        { key: 'B', text: q.option_b },
        { key: 'C', text: q.option_c },
        { key: 'D', text: q.option_d }
      ]
    }));
    
    return res.status(201).json({
      status: 'success',
      message: 'Bắt đầu bài kiểm tra thành công',
      data: {
        user_exam_id: userExamId,
        exam_info: {
          id: exam.id,
          title: exam.title,
          time_limit: exam.time_limit,
          total_questions: exam.total_questions
        },
        questions: formattedQuestions
      }
    });
  } catch (error) {
    console.error('Error starting exam:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi bắt đầu bài kiểm tra',
      error: error.message
    });
  }
};

// Nộp bài kiểm tra
exports.submitExam = async (req, res) => {
  try {
    const { user_exam_id, answers } = req.body;
    const user_id = req.user.id;
    
    console.log('Submit request received:', { user_exam_id, user_id, answerCount: answers?.length });
    
    // Kiểm tra user_exam tồn tại và thuộc về user hiện tại
    const [userExams] = await db.query(`
      SELECT ue.*, e.total_questions
      FROM user_exam ue
      JOIN exams e ON ue.exam_id = e.id
      WHERE ue.id = ? AND ue.user_id = ?
    `, [user_exam_id, user_id]);
    
    if (userExams.length === 0) {
      console.log('No user exam found');
      return res.status(404).json({
        status: 'error',
        message: 'Bài kiểm tra không tồn tại hoặc không thuộc về bạn'
      });
    }
    
    const userExam = userExams[0];
    console.log('User exam found:', userExam);
    
    // Nếu bài kiểm tra đã được nộp trước đó, vẫn tiếp tục xử lý và cập nhật điểm số
    if (userExam.completed_at) {
      console.log('Exam already completed, updating score');
    }
    
    // Lấy các câu hỏi của bài kiểm tra
    const [questions] = await db.query(`
      SELECT q.* 
      FROM questions q
      JOIN question_test qt ON q.id = qt.question_id
      WHERE qt.user_exam_id = ?
    `, [user_exam_id]);
    
    console.log('Questions found:', questions.length);
    console.log('Answers received:', answers?.length);
    
    // Kiểm tra số lượng câu trả lời có bằng số câu hỏi không
    if (!answers || answers.length < questions.length) {
      console.log('Not enough answers');
      return res.status(400).json({
        status: 'error',
        message: `Vui lòng trả lời tất cả ${questions.length} câu hỏi trước khi nộp bài.`
      });
    }
    
    // Kiểm tra cấu trúc đúng của answers
    const validAnswers = answers.every(a => 
      a && typeof a === 'object' && 
      a.question_id && 
      typeof a.question_id === 'number' &&
      a.answer && 
      typeof a.answer === 'string'
    );
    
    if (!validAnswers) {
      console.log('Invalid answer format');
      return res.status(400).json({
        status: 'error',
        message: 'Định dạng câu trả lời không hợp lệ'
      });
    }
    
    // Tính điểm dựa trên đáp án
    let correctCount = 0;
    
    for (const question of questions) {
      const userAnswer = answers.find(a => a.question_id === question.id);
      
      if (userAnswer && userAnswer.answer === question.correct_answer) {
        correctCount++;
      }
    }
    
    console.log('Correct answers:', correctCount);
    
    // Tính điểm theo thang 10
    const totalQuestions = userExam.total_questions;
    const score = (correctCount / totalQuestions) * 10;
    
    console.log('Final score:', score);
    
    // Cập nhật điểm và đánh dấu hoàn thành (hoặc cập nhật thời gian hoàn thành nếu đã nộp trước đó)
    await db.query(`
      UPDATE user_exam
      SET score = ?, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [score, user_exam_id]);
    
    // Lấy các câu hỏi với đáp án đúng
    const questionsWithAnswers = questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: [
        { key: 'A', text: q.option_a },
        { key: 'B', text: q.option_b },
        { key: 'C', text: q.option_c },
        { key: 'D', text: q.option_d }
      ],
      correct_answer: q.correct_answer,
      user_answer: (answers.find(a => a.question_id === q.id) || {}).answer
    }));
    
    return res.status(200).json({
      status: 'success',
      message: 'Nộp bài kiểm tra thành công',
      data: {
        score,
        total_questions: totalQuestions,
        correct_count: correctCount,
        questions: questionsWithAnswers
      }
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi nộp bài kiểm tra',
      error: error.message
    });
  }
};

// Lấy lịch sử kiểm tra của người dùng
exports.getUserExamHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [history] = await db.query(`
      SELECT ue.*, e.title, e.time_limit, e.total_questions, 
      c.title as chapter_title, co.title as course_title,
      co.id as course_id
      FROM user_exam ue
      JOIN exams e ON ue.exam_id = e.id
      JOIN chapters c ON e.chapter_id = c.id
      JOIN courses co ON e.course_id = co.id
      WHERE ue.user_id = ?
      ORDER BY ue.created_at DESC
    `, [user_id]);
    
    return res.status(200).json({
      status: 'success',
      data: {
        history
      }
    });
  } catch (error) {
    console.error('Error fetching exam history:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi lấy lịch sử kiểm tra',
      error: error.message
    });
  }
};

// Lấy kết quả của một bài kiểm tra
exports.getExamResult = async (req, res) => {
  try {
    const userExamId = req.params.userExamId;
    const user_id = req.user.id;
    
    // Kiểm tra user_exam tồn tại và thuộc về user hiện tại
    const [userExams] = await db.query(`
      SELECT ue.*, e.title, e.time_limit, e.total_questions, 
      c.title as chapter_title, co.title as course_title
      FROM user_exam ue
      JOIN exams e ON ue.exam_id = e.id
      JOIN chapters c ON e.chapter_id = c.id
      JOIN courses co ON e.course_id = co.id
      WHERE ue.id = ? AND ue.user_id = ?
    `, [userExamId, user_id]);
    
    if (userExams.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Bài kiểm tra không tồn tại hoặc không thuộc về bạn'
      });
    }
    
    const userExam = userExams[0];
    
    // Kiểm tra bài đã nộp chưa
    if (!userExam.completed_at) {
      return res.status(400).json({
        status: 'error',
        message: 'Bài kiểm tra chưa được hoàn thành'
      });
    }
    
    // Lấy các câu hỏi và đáp án của bài kiểm tra
    const [questions] = await db.query(`
      SELECT q.* 
      FROM questions q
      JOIN question_test qt ON q.id = qt.question_id
      WHERE qt.user_exam_id = ?
    `, [userExamId]);
    
    // Format lại câu hỏi để gửi về cho client
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: [
        { key: 'A', text: q.option_a },
        { key: 'B', text: q.option_b },
        { key: 'C', text: q.option_c },
        { key: 'D', text: q.option_d }
      ],
      correct_answer: q.correct_answer
    }));
    
    return res.status(200).json({
      status: 'success',
      data: {
        exam_result: userExam,
        questions: formattedQuestions
      }
    });
  } catch (error) {
    console.error('Error fetching exam result:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi lấy kết quả bài kiểm tra',
      error: error.message
    });
  }
};

module.exports = exports; 