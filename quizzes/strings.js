// quizzes/strings.js
const quizData = [
  {
    code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str1[20] = "hello";\n    char str2[] = "world";\n    strcat(str1, " ");\n    strcat(str1, str2);\n    printf("%s\\n", str1);\n    printf("Length: %zu\\n", strlen(str1));\n    return 0;\n}`,
    question: "מה תדפיס תוכנית זו?",
    answers: [
      "hello world\\nLength: 11",
      "hello world\\nLength: 12",
      "helloworld\\nLength: 10",
      "hello world\\nLength: 10",
    ],
    correct: 3,
    hint: "`strcat` משרשרת מחרוזות. `strlen` מחזירה את האורך לא כולל תו הסיום `\\0`.",
    explanation:
      'התוכנית משרשרת את המחרוזת " world" למחרוזת "hello", ויוצרת "hello world". אורך המחרוזת הזו הוא 11 תווים. `strlen` סופרת את התווים עד תו הסיום, ולכן הפלט השני יהיה 11.',
  },
];
