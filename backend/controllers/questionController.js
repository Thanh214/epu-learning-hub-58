const db = require('../config/db');

// Lấy tất cả câu hỏi của một khóa học
exports.getQuestionsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Kiểm tra khóa học tồn tại
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Khóa học không tồn tại'
      });
    }
    
    // Lấy chương trong khóa học
    const [chapters] = await db.query(`
      SELECT id, title, chapter_order 
      FROM chapters 
      WHERE course_id = ? 
      ORDER BY chapter_order
    `, [courseId]);
    
    // Lấy câu hỏi cho từng chương
    const questionsData = [];
    
    for (const chapter of chapters) {
      const [questions] = await db.query(`
        SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer
        FROM questions
        WHERE chapter_id = ?
        ORDER BY id
      `, [chapter.id]);
      
      questionsData.push({
        chapter_id: chapter.id,
        chapter_title: chapter.title,
        questions: questions
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        chapters: questionsData
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi lấy câu hỏi',
      error: error.message
    });
  }
};

// Lấy tất cả câu hỏi của một chương
exports.getQuestionsByChapter = async (req, res) => {
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
    
    // Lấy câu hỏi cho chương
    const [questions] = await db.query(`
      SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer
      FROM questions
      WHERE chapter_id = ?
      ORDER BY id
    `, [chapterId]);
    
    return res.status(200).json({
      status: 'success',
      data: {
        chapter: chapters[0],
        questions: questions
      }
    });
  } catch (error) {
    console.error('Error fetching chapter questions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi lấy câu hỏi cho chương',
      error: error.message
    });
  }
};

// Thêm câu hỏi mới
exports.createQuestion = async (req, res) => {
  try {
    const { chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!chapter_id || !question_text || !option_a || !option_b || !correct_answer) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    // Kiểm tra chương tồn tại
    const [chapters] = await db.query('SELECT * FROM chapters WHERE id = ?', [chapter_id]);
    if (chapters.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Chương không tồn tại'
      });
    }
    
    // Thêm câu hỏi mới
    const [result] = await db.query(`
      INSERT INTO questions 
      (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer]);
    
    // Lấy thông tin câu hỏi vừa tạo
    const [newQuestion] = await db.query('SELECT * FROM questions WHERE id = ?', [result.insertId]);
    
    return res.status(201).json({
      status: 'success',
      message: 'Thêm câu hỏi thành công',
      data: {
        question: newQuestion[0]
      }
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi thêm câu hỏi',
      error: error.message
    });
  }
};

// Cập nhật câu hỏi
exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    
    // Kiểm tra câu hỏi tồn tại
    const [existingQuestion] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    if (existingQuestion.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Câu hỏi không tồn tại'
      });
    }
    
    // Cập nhật câu hỏi
    const updateFields = [];
    const updateValues = [];
    
    if (question_text) {
      updateFields.push('question_text = ?');
      updateValues.push(question_text);
    }
    
    if (option_a) {
      updateFields.push('option_a = ?');
      updateValues.push(option_a);
    }
    
    if (option_b) {
      updateFields.push('option_b = ?');
      updateValues.push(option_b);
    }
    
    if (option_c !== undefined) {
      updateFields.push('option_c = ?');
      updateValues.push(option_c);
    }
    
    if (option_d !== undefined) {
      updateFields.push('option_d = ?');
      updateValues.push(option_d);
    }
    
    if (correct_answer) {
      updateFields.push('correct_answer = ?');
      updateValues.push(correct_answer);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Không có dữ liệu để cập nhật'
      });
    }
    
    // Thêm ID vào cuối mảng
    updateValues.push(questionId);
    
    const updateQuery = `
      UPDATE questions
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    await db.query(updateQuery, updateValues);
    
    // Lấy thông tin câu hỏi sau khi cập nhật
    const [updatedQuestion] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    
    return res.status(200).json({
      status: 'success',
      message: 'Cập nhật câu hỏi thành công',
      data: {
        question: updatedQuestion[0]
      }
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi cập nhật câu hỏi',
      error: error.message
    });
  }
};

// Xóa câu hỏi
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // Kiểm tra câu hỏi tồn tại
    const [existingQuestion] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    if (existingQuestion.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Câu hỏi không tồn tại'
      });
    }
    
    // Xóa câu hỏi
    await db.query('DELETE FROM questions WHERE id = ?', [questionId]);
    
    return res.status(200).json({
      status: 'success',
      message: 'Xóa câu hỏi thành công'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi xóa câu hỏi',
      error: error.message
    });
  }
};

// Tạo câu hỏi mẫu cho chương
exports.createSampleQuestions = async (req, res) => {
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
    
    const chapter = chapters[0];
    
    // Tạo 5 câu hỏi mẫu
    const sampleQuestions = [
      {
        question_text: `Câu hỏi 1 về ${chapter.title}?`,
        option_a: 'Đáp án A cho câu hỏi 1',
        option_b: 'Đáp án B cho câu hỏi 1',
        option_c: 'Đáp án C cho câu hỏi 1',
        option_d: 'Đáp án D cho câu hỏi 1',
        correct_answer: 'A'
      },
      {
        question_text: `Câu hỏi 2 về ${chapter.title}?`,
        option_a: 'Đáp án A cho câu hỏi 2',
        option_b: 'Đáp án B cho câu hỏi 2',
        option_c: 'Đáp án C cho câu hỏi 2',
        option_d: 'Đáp án D cho câu hỏi 2',
        correct_answer: 'B'
      },
      {
        question_text: `Câu hỏi 3 về ${chapter.title}?`,
        option_a: 'Đáp án A cho câu hỏi 3',
        option_b: 'Đáp án B cho câu hỏi 3',
        option_c: 'Đáp án C cho câu hỏi 3',
        option_d: 'Đáp án D cho câu hỏi 3',
        correct_answer: 'C'
      },
      {
        question_text: `Câu hỏi 4 về ${chapter.title}?`,
        option_a: 'Đáp án A cho câu hỏi 4',
        option_b: 'Đáp án B cho câu hỏi 4',
        option_c: 'Đáp án C cho câu hỏi 4',
        option_d: 'Đáp án D cho câu hỏi 4',
        correct_answer: 'D'
      },
      {
        question_text: `Câu hỏi 5 về ${chapter.title}?`,
        option_a: 'Đáp án A cho câu hỏi 5',
        option_b: 'Đáp án B cho câu hỏi 5',
        option_c: 'Đáp án C cho câu hỏi 5',
        option_d: 'Đáp án D cho câu hỏi 5',
        correct_answer: 'A'
      }
    ];
    
    // Thêm các câu hỏi vào cơ sở dữ liệu
    for (const question of sampleQuestions) {
      await db.query(`
        INSERT INTO questions 
        (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        chapterId,
        question.question_text,
        question.option_a,
        question.option_b,
        question.option_c,
        question.option_d,
        question.correct_answer
      ]);
    }
    
    return res.status(201).json({
      status: 'success',
      message: `Đã tạo 5 câu hỏi mẫu cho chương "${chapter.title}"`,
      data: {
        chapter_id: chapterId,
        question_count: sampleQuestions.length
      }
    });
  } catch (error) {
    console.error('Error creating sample questions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi tạo câu hỏi mẫu',
      error: error.message
    });
  }
};

// Tạo câu hỏi mẫu cho tất cả các chương trong khóa học
exports.createSampleQuestionsForCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Kiểm tra khóa học tồn tại
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Khóa học không tồn tại'
      });
    }
    
    // Lấy tất cả các chương trong khóa học
    const [chapters] = await db.query('SELECT * FROM chapters WHERE course_id = ?', [courseId]);
    
    if (chapters.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Khóa học không có chương nào'
      });
    }
    
    // Xóa câu hỏi cũ nếu có
    for (const chapter of chapters) {
      await db.query('DELETE FROM questions WHERE chapter_id = ?', [chapter.id]);
    }
    
    // Tạo câu hỏi mẫu cho mỗi chương
    let totalQuestions = 0;
    for (const chapter of chapters) {
      // Tạo 5 câu hỏi mẫu cho mỗi chương
      for (let i = 1; i <= 5; i++) {
        await db.query(`
          INSERT INTO questions 
          (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          chapter.id,
          `Câu hỏi ${i} liên quan đến ${chapter.title}?`,
          `Đáp án A cho câu hỏi ${i}`,
          `Đáp án B cho câu hỏi ${i}`,
          `Đáp án C cho câu hỏi ${i}`,
          `Đáp án D cho câu hỏi ${i}`,
          ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
        ]);
        totalQuestions++;
      }
    }
    
    return res.status(201).json({
      status: 'success',
      message: `Đã tạo ${totalQuestions} câu hỏi mẫu cho ${chapters.length} chương`,
      data: {
        course_id: courseId,
        chapter_count: chapters.length,
        question_count: totalQuestions
      }
    });
  } catch (error) {
    console.error('Error creating sample questions for course:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi khi tạo câu hỏi mẫu cho khóa học',
      error: error.message
    });
  }
};

module.exports = exports; 