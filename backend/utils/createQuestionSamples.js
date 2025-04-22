
const db = require('../config/db');
const questionSamples = require('./questionSamples');

// Tạo câu hỏi mẫu
const createQuestionSamples = async () => {
  try {
    console.log('Bắt đầu tạo dữ liệu mẫu cho câu hỏi...');

    // Đếm số câu hỏi hiện có
    const [existingQuestions] = await db.query('SELECT COUNT(*) as count FROM questions');
    
    if (existingQuestions[0].count > 0) {
      console.log(`Đã có ${existingQuestions[0].count} câu hỏi trong cơ sở dữ liệu.`);
      console.log('Bỏ qua quá trình tạo dữ liệu mẫu câu hỏi.');
      return;
    }
    
    // Biến theo dõi số câu hỏi đã tạo
    let createdQuestions = 0;
    
    // Duyệt qua từng mục câu hỏi mẫu theo chương
    for (const chapterQuestions of questionSamples) {
      const chapterId = chapterQuestions.chapter_id;
      
      // Kiểm tra xem chương có tồn tại không
      const [chapter] = await db.query('SELECT * FROM chapters WHERE id = ?', [chapterId]);
      
      if (chapter.length === 0) {
        console.log(`Chương có ID ${chapterId} không tồn tại, bỏ qua câu hỏi của chương này.`);
        continue;
      }
      
      // Tạo câu hỏi cho chương
      for (const question of chapterQuestions.questions) {
        await db.query(
          'INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            chapterId,
            question.question_text,
            question.option_a,
            question.option_b,
            question.option_c,
            question.option_d,
            question.correct_answer
          ]
        );
        
        createdQuestions++;
      }
      
      console.log(`Đã tạo ${chapterQuestions.questions.length} câu hỏi cho chương ${chapterId}`);
    }
    
    console.log(`Hoàn tất: Đã tạo tổng cộng ${createdQuestions} câu hỏi mẫu.`);
    
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho câu hỏi:', error);
  }
};

// Chạy function nếu được gọi trực tiếp từ command line
if (require.main === module) {
  createQuestionSamples()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  // Export function để có thể sử dụng trong module khác
  module.exports = createQuestionSamples;
}
