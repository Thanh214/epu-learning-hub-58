
const db = require('../config/db');

// Lấy tất cả câu hỏi cho một chương
exports.getQuestionsByChapterId = async (req, res) => {
  try {
    const chapterId = req.params.id;
    
    // Kiểm tra chương có tồn tại không
    const [chapters] = await db.query(
      'SELECT * FROM chapters WHERE id = ?',
      [chapterId]
    );
    
    if (chapters.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy chương'
      });
    }
    
    // Lấy câu hỏi cho chương
    const [questions] = await db.query(
      'SELECT * FROM questions WHERE chapter_id = ? ORDER BY id',
      [chapterId]
    );
    
    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: {
        questions
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể lấy câu hỏi',
      error: error.message
    });
  }
};

// Lấy tất cả câu hỏi cho một khóa học, được nhóm theo chương
exports.getQuestionsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Kiểm tra khóa học có tồn tại không
    const [courses] = await db.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Lấy tất cả chương của khóa học
    const [chapters] = await db.query(
      'SELECT * FROM chapters WHERE course_id = ? ORDER BY chapter_order',
      [courseId]
    );
    
    // Lấy câu hỏi cho từng chương
    const result = [];
    
    for (const chapter of chapters) {
      const [questions] = await db.query(
        'SELECT * FROM questions WHERE chapter_id = ? ORDER BY id',
        [chapter.id]
      );
      
      result.push({
        chapter_id: chapter.id,
        chapter_title: chapter.title,
        questions: questions
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        course_id: parseInt(courseId),
        chapters: result
      }
    });
  } catch (error) {
    console.error('Error fetching questions by course:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể lấy câu hỏi',
      error: error.message
    });
  }
};

// Tạo câu hỏi mới
exports.createQuestion = async (req, res) => {
  try {
    const { chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    
    // Validate dữ liệu
    if (!chapter_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      return res.status(400).json({
        status: 'fail',
        message: 'Vui lòng cung cấp đầy đủ thông tin câu hỏi và đáp án'
      });
    }
    
    // Kiểm tra chương có tồn tại không
    const [chapters] = await db.query(
      'SELECT * FROM chapters WHERE id = ?',
      [chapter_id]
    );
    
    if (chapters.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy chương'
      });
    }
    
    // Tạo câu hỏi mới
    const [result] = await db.query(
      'INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer]
    );
    
    // Lấy câu hỏi vừa tạo
    const [newQuestion] = await db.query(
      'SELECT * FROM questions WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Tạo câu hỏi thành công',
      data: {
        question: newQuestion[0]
      }
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể tạo câu hỏi',
      error: error.message
    });
  }
};

// Cập nhật câu hỏi
exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    
    // Kiểm tra câu hỏi tồn tại không
    const [existingQuestion] = await db.query(
      'SELECT * FROM questions WHERE id = ?',
      [questionId]
    );
    
    if (existingQuestion.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy câu hỏi'
      });
    }
    
    // Xây dựng câu lệnh cập nhật
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
    
    if (option_c) {
      updateFields.push('option_c = ?');
      updateValues.push(option_c);
    }
    
    if (option_d) {
      updateFields.push('option_d = ?');
      updateValues.push(option_d);
    }
    
    if (correct_answer) {
      updateFields.push('correct_answer = ?');
      updateValues.push(correct_answer);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Không có dữ liệu để cập nhật'
      });
    }
    
    // Thêm ID vào cuối mảng tham số
    updateValues.push(questionId);
    
    // Cập nhật câu hỏi
    await db.query(
      `UPDATE questions SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Lấy câu hỏi sau khi cập nhật
    const [updatedQuestion] = await db.query(
      'SELECT * FROM questions WHERE id = ?',
      [questionId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Cập nhật câu hỏi thành công',
      data: {
        question: updatedQuestion[0]
      }
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể cập nhật câu hỏi',
      error: error.message
    });
  }
};

// Xóa câu hỏi
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // Kiểm tra câu hỏi tồn tại không
    const [existingQuestion] = await db.query(
      'SELECT * FROM questions WHERE id = ?',
      [questionId]
    );
    
    if (existingQuestion.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy câu hỏi'
      });
    }
    
    // Xóa câu hỏi
    await db.query(
      'DELETE FROM questions WHERE id = ?',
      [questionId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Xóa câu hỏi thành công'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể xóa câu hỏi',
      error: error.message
    });
  }
};

module.exports = exports;
