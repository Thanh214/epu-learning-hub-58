
// Mẫu câu hỏi cho khóa học React
const reactQuestions = [
  // Chương 1: Giới thiệu React
  {
    chapter_id: 1,
    questions: [
      {
        question_text: 'React được phát triển bởi công ty nào?',
        option_a: 'Google',
        option_b: 'Facebook (Meta)',
        option_c: 'Microsoft',
        option_d: 'Amazon',
        correct_answer: 'B'
      },
      {
        question_text: 'React là thư viện để làm gì?',
        option_a: 'Xây dựng giao diện người dùng',
        option_b: 'Quản lý cơ sở dữ liệu',
        option_c: 'Xử lý back-end',
        option_d: 'Quản lý mạng',
        correct_answer: 'A'
      },
      {
        question_text: 'React sử dụng cơ chế nào để tăng hiệu suất?',
        option_a: 'Virtual Registry',
        option_b: 'DOM Mapping',
        option_c: 'Virtual DOM',
        option_d: 'Shadow DOM',
        correct_answer: 'C'
      },
      {
        question_text: 'Phiên bản JavaScript được khuyến nghị khi sử dụng React là gì?',
        option_a: 'ES5',
        option_b: 'ES6+',
        option_c: 'TypeScript',
        option_d: 'CoffeeScript',
        correct_answer: 'B'
      },
      {
        question_text: 'Tệp mở rộng thông thường cho component React khi sử dụng JavaScript là gì?',
        option_a: '.jsx',
        option_b: '.js',
        option_c: '.react',
        option_d: '.rct',
        correct_answer: 'A'
      }
    ]
  },
  
  // Chương 2: React Components
  {
    chapter_id: 2,
    questions: [
      {
        question_text: 'Đâu là 2 loại component chính trong React?',
        option_a: 'DOM Components và Shadow Components',
        option_b: 'Class Components và Function Components',
        option_c: 'Simple Components và Complex Components',
        option_d: 'Parent Components và Child Components',
        correct_answer: 'B'
      },
      {
        question_text: 'Dữ liệu được truyền từ component cha sang component con qua?',
        option_a: 'state',
        option_b: 'refs',
        option_c: 'props',
        option_d: 'context',
        correct_answer: 'C'
      },
      {
        question_text: 'Phương thức nào được sử dụng để render JSX trong class component?',
        option_a: 'display()',
        option_b: 'view()',
        option_c: 'render()',
        option_d: 'output()',
        correct_answer: 'C'
      },
      {
        question_text: 'Đâu là cú pháp đúng để render một component trong React?',
        option_a: '<ComponentName>',
        option_b: '<ComponentName />',
        option_c: '<component name="ComponentName">',
        option_d: 'render(ComponentName)',
        correct_answer: 'B'
      },
      {
        question_text: 'State trong React component là gì?',
        option_a: 'Dữ liệu được truyền từ component cha',
        option_b: 'Dữ liệu tĩnh không thay đổi',
        option_c: 'Dữ liệu cục bộ của component có thể thay đổi',
        option_d: 'Thuộc tính của DOM ảo',
        correct_answer: 'C'
      }
    ]
  },
  
  // Chương 3: React Hooks
  {
    chapter_id: 3,
    questions: [
      {
        question_text: 'React Hooks được giới thiệu từ phiên bản nào?',
        option_a: 'React 15.0',
        option_b: 'React 16.0',
        option_c: 'React 16.8',
        option_d: 'React 17.0',
        correct_answer: 'C'
      },
      {
        question_text: 'useState hook dùng để làm gì?',
        option_a: 'Khai báo biến cục bộ',
        option_b: 'Quản lý state trong function component',
        option_c: 'Tạo effect side trong component',
        option_d: 'Tối ưu hiệu suất',
        correct_answer: 'B'
      },
      {
        question_text: 'useEffect hook thực thi ở thời điểm nào?',
        option_a: 'Trước khi component render',
        option_b: 'Chỉ khi component khởi tạo',
        option_c: 'Sau khi component render và mỗi khi dependencies thay đổi',
        option_d: 'Chỉ khi component bị hủy',
        correct_answer: 'C'
      },
      {
        question_text: 'Hook nào dùng để lưu lại giá trị trong React mà không gây re-render?',
        option_a: 'useState',
        option_b: 'useRef',
        option_c: 'useContext',
        option_d: 'useMemo',
        correct_answer: 'B'
      },
      {
        question_text: 'Quy tắc quan trọng khi sử dụng hooks là?',
        option_a: 'Hooks phải được gọi trong một class component',
        option_b: 'Hooks có thể được gọi bên trong điều kiện',
        option_c: 'Hooks phải được gọi ở đầu function component, không nằm trong điều kiện hoặc vòng lặp',
        option_d: 'Hooks chỉ được sử dụng trong useEffect',
        correct_answer: 'C'
      }
    ]
  }
];

// Mẫu câu hỏi cho khóa học SQL
const sqlQuestions = [
  // Chương 4: Giới thiệu SQL
  {
    chapter_id: 4,
    questions: [
      {
        question_text: 'SQL là viết tắt của?',
        option_a: 'Structured Query Language',
        option_b: 'Simple Query Language',
        option_c: 'Standard Query Language',
        option_d: 'System Query Language',
        correct_answer: 'A'
      },
      {
        question_text: 'Câu lệnh SQL nào dùng để lấy dữ liệu từ database?',
        option_a: 'GET',
        option_b: 'OPEN',
        option_c: 'SELECT',
        option_d: 'EXTRACT',
        correct_answer: 'C'
      },
      {
        question_text: 'Để thêm dữ liệu vào bảng, ta sử dụng câu lệnh?',
        option_a: 'ADD',
        option_b: 'INSERT INTO',
        option_c: 'UPDATE',
        option_d: 'SAVE',
        correct_answer: 'B'
      },
      {
        question_text: 'Lệnh nào dùng để tạo bảng mới trong SQL?',
        option_a: 'CREATE TABLE',
        option_b: 'BUILD TABLE',
        option_c: 'GENERATE TABLE',
        option_d: 'MAKE TABLE',
        correct_answer: 'A'
      },
      {
        question_text: 'Phương thức nào sử dụng để sắp xếp kết quả trong SQL?',
        option_a: 'SORT BY',
        option_b: 'ORDER BY',
        option_c: 'ARRANGE BY',
        option_d: 'GROUP BY',
        correct_answer: 'B'
      }
    ]
  },
  
  // Chương 5: SQL Joins và Relationships
  {
    chapter_id: 5,
    questions: [
      {
        question_text: 'JOIN nào trong SQL trả về tất cả các dòng từ bảng bên trái và các dòng khớp từ bảng bên phải?',
        option_a: 'RIGHT JOIN',
        option_b: 'LEFT JOIN',
        option_c: 'INNER JOIN',
        option_d: 'FULL JOIN',
        correct_answer: 'B'
      },
      {
        question_text: 'Khóa ngoại (Foreign Key) dùng để?',
        option_a: 'Định danh duy nhất trong bảng',
        option_b: 'Thiết lập mối quan hệ giữa các bảng',
        option_c: 'Tạo chỉ mục cho bảng',
        option_d: 'Mã hóa dữ liệu',
        correct_answer: 'B'
      },
      {
        question_text: 'JOIN nào chỉ trả về các dòng khớp giữa hai bảng?',
        option_a: 'LEFT JOIN',
        option_b: 'RIGHT JOIN',
        option_c: 'INNER JOIN',
        option_d: 'OUTER JOIN',
        correct_answer: 'C'
      },
      {
        question_text: 'Mối quan hệ một-nhiều (One-to-Many) thường được thể hiện như thế nào trong cơ sở dữ liệu?',
        option_a: 'Sử dụng bảng trung gian',
        option_b: 'Sử dụng khóa ngoại trong bảng "nhiều"',
        option_c: 'Sử dụng khóa ngoại trong bảng "một"',
        option_d: 'Sử dụng chỉ mục (index)',
        correct_answer: 'B'
      },
      {
        question_text: 'Câu lệnh nào dùng để hạn chế kết quả trả về?',
        option_a: 'LIMIT',
        option_b: 'RESTRICT',
        option_c: 'WHERE',
        option_d: 'HAVING',
        correct_answer: 'C'
      }
    ]
  }
];

// Mẫu câu hỏi cho khóa học Java
const javaQuestions = [
  // Chương 6: Giới thiệu Java
  {
    chapter_id: 6,
    questions: [
      {
        question_text: 'Java được phát triển bởi công ty nào?',
        option_a: 'Microsoft',
        option_b: 'Apple',
        option_c: 'Sun Microsystems (nay thuộc Oracle)',
        option_d: 'IBM',
        correct_answer: 'C'
      },
      {
        question_text: 'JVM là viết tắt của?',
        option_a: 'Java Virtual Machine',
        option_b: 'Java Variable Method',
        option_c: 'Java Visual Module',
        option_d: 'Java Verified Memory',
        correct_answer: 'A'
      },
      {
        question_text: 'Mã Java được biên dịch thành?',
        option_a: 'Machine code',
        option_b: 'Byte code',
        option_c: 'Source code',
        option_d: 'Binary code',
        correct_answer: 'B'
      },
      {
        question_text: 'Phần mở rộng của file mã nguồn Java là?',
        option_a: '.java',
        option_b: '.js',
        option_c: '.class',
        option_d: '.jvm',
        correct_answer: 'A'
      },
      {
        question_text: 'JDK là viết tắt của?',
        option_a: 'Java Development Kit',
        option_b: 'Java Deployment Kit',
        option_c: 'Java Design Kit',
        option_d: 'Java Database Kit',
        correct_answer: 'A'
      }
    ]
  },
  
  // Chương 7: Cấu trúc dữ liệu trong Java
  {
    chapter_id: 7,
    questions: [
      {
        question_text: 'Khác biệt giữa Array và ArrayList trong Java?',
        option_a: 'Array có kích thước cố định, ArrayList có kích thước động',
        option_b: 'Array lưu trữ object, ArrayList lưu trữ primitive',
        option_c: 'Array nhanh hơn ArrayList',
        option_d: 'Không có sự khác biệt',
        correct_answer: 'A'
      },
      {
        question_text: 'Collection nào cung cấp truy cập phần tử theo index?',
        option_a: 'Set',
        option_b: 'List',
        option_c: 'Map',
        option_d: 'Queue',
        correct_answer: 'B'
      },
      {
        question_text: 'Interface Map trong Java dùng để lưu trữ các cặp gì?',
        option_a: 'Index-Value',
        option_b: 'Key-Value',
        option_c: 'Object-Object',
        option_d: 'Value-Type',
        correct_answer: 'B'
      },
      {
        question_text: 'LinkedList trong Java là cấu trúc dữ liệu nào?',
        option_a: 'Danh sách liên kết đơn',
        option_b: 'Danh sách liên kết đôi',
        option_c: 'Danh sách liên kết vòng',
        option_d: 'Ngăn xếp',
        correct_answer: 'B'
      },
      {
        question_text: 'Cấu trúc dữ liệu nào đảm bảo các phần tử không trùng lặp trong Java?',
        option_a: 'ArrayList',
        option_b: 'Vector',
        option_c: 'HashSet',
        option_d: 'LinkedList',
        correct_answer: 'C'
      }
    ]
  }
];

// Kết hợp tất cả câu hỏi
const allQuestions = [
  ...reactQuestions,
  ...sqlQuestions,
  ...javaQuestions
];

module.exports = allQuestions;
