const quizData = [
  {
    code: `void f() {

    unsigned int i = 1, j = 1 << sizeof(int) * 8 - 1;
    unsigned int x = 0xF3AE8366;

    while (i < j) {

        if ((x & i) > (x & j)) {
            x |= j;
            x &= ~i;
        }

        i <<= 1;
        j >>= 1;
    }

    printf("%x\\n", x);
}`,
    question: "מה יהיה הפלט של קריאה לפונקציה f?",
    answers: [
      "66c775cf",
      "f3ae8366",
      "c6633075",
      "99e11cea",
      "התוכנית לא תעבור קומפילציה",
      "אף תשובה מהתשובות האחרות אינה נכונה",
    ],
    correct: 0,
    hint: "שימו לב לקדימות האופרטורים בביטוי `1 << sizeof(int) * 8 - 1`. פעולות הכפל והחיסור קודמות לפעולת הזיזה (`<<`), לכן הערך `sizeof(int) * 8 - 1` מחושב ראשון. בהנחה שגודל של `int` הוא 4 בתים, המשתנה `j` יאותחל לערך שייצוגו הבינארי הוא `10000000000000000000000000000000`, כלומר מסכה עבור הביט המשמעותית ביותר. למעשה, הקוד סורק את הביטים של המספר `x` משני הכיוונים בו־זמנית.",
    explanation:
      "האלגוריתם הנתון הופך את סדר הביטים של המשתנה `x`. הלולאה עוברת על הביטים של המספר בו־זמנית משני הקצוות: המשתנה `i` משמש כמסכה שמתחילה מהביט הימנית ביותר (LSB) וזזה שמאלה, והמשתנה `j` מתחיל מהביט השמאלית ביותר (MSB) וזז ימינה. בכל איטרציה, אם הביט הימנית שנבדקת היא 1 והשמאלית היא 0, הקוד מחליף ביניהן.\n\nהערך ההתחלתי של `x` הוא `0xF3AE8366`, שבייצוג בינארי הוא `11110011101011101000001101100110`. המשתנים `i` ו־`j` צועדים בקצב קבוע אחד מול השני. כאשר `i` מצביע על ביט דולקת ו־`j` על ביט כבויה, מתבצעת החלפה ביניהן. לאחר שהלולאה מסתיימת, סדר הביטים של `x` מתהפך לחלוטין. הייצוג הבינארי ההפוך הוא `01100110110001110111010111001111`, אשר בבסיס הקסדצימלי שווה ל־`66c775cf`.",
  },
  {
    code: `typedef unsigned char BYTE;

void f() {

    BYTE mask1 = 0xFF, mask2 = 0xFF;
    BYTE num = 0x38, result;

    while (num & mask1) {
        mask1 <<= 1;
        mask2 >>= 1;
    }

    result = num | mask2;
    printf("%x\\n", result);
}`,
    question: "מה יהיה הפלט של קריאה לפונקציה f?",
    answers: ["3b", "f8", "38", "fb", "כל התשובות האחרות אינן נכונות"],
    correct: 0,
    hint: "הלולאה מפסיקה כאשר הביטוי `num & mask1` מחזיר 0. עקבו אחר השינוי בערך של `mask1` בכל איטרציה כדי להבין מתי בדיוק הלולאה תסתיים, ומה יהיה ערכו הסופי של `mask2` באותו הרגע.",
    explanation:
      "המשתנה `num` מאותחל לערך `0x38`, שבייצוג בינארי הוא `00111000`. המשתנה `mask1` מתחיל כ-`0xFF`, כלומר `11111111`. הלולאה `while` ממשיכה לרוץ כל עוד תוצאת הביטוי `num & mask1` שונה מאפס.\n\nבכל איטרציה של הלולאה, `mask1` מוזז בביט אחת שמאלה (דבר המכניס `0` מימין) ו-`mask2` מוזז בביט אחת ימינה. הלולאה תיעצר כאשר `mask1` יוזז מספיק שמאלה כך שלא יהיו לו ביטים דולקות במקביל לביטים הדולקות של `num`. זה קורה לאחר 6 איטרציות, כאשר `mask1` שווה ל-`11000000`.\n\nבאותו שלב, `mask2`, שהוזז ימינה 6 פעמים, שווה ל-`00000011`. הפקודה האחרונה מבצעת פעולת `OR` בינארית בין `num` ל-`mask2` הסופי. החישוב הוא `00111000 | 00000011`, ותוצאתו היא `00111011`. ערך זה בבסיס הקסדצימלי הוא `3b`.",
  },
  {
    code: `void main() {
    unsigned char x = 0xff;
    x = (x >> 3) & 0xf0;
    printf("%d\\n", x);
}`,
    question: "מה יהיה הפלט של התוכנית הבאה?",
    answers: ["16", "240", "31", "255", "כל התשובות האחרות אינן נכונות"],
    correct: 0,
    hint: "שימו לב שפונקציית ההדפסה משתמשת בפרמטר `%d`, כלומר הפלט הנדרש הוא בבסיס 10.",
    explanation:
      "הפעולה מתבצעת בשני שלבים על המשתנה `x` המאותחל לערך `0xff`.\n\nתחילה, המשתנה `x`, שערכו הבינארי הוא `11111111`, עובר הזזת ביטים (shift) של 3 מקומות ימינה. כיוון שהמשתנה הוא `unsigned`, יוכנסו אפסים משמאל. התוצאה לאחר ההזזה היא `00011111`.\n\nלאחר מכן, מתבצעת פעולת `AND` בינארית בין התוצאה מהשלב הקודם (`00011111`) לבין המסכה `0xf0` (שבבינארית היא `11110000`). תוצאת הפעולה `00011111 & 11110000` היא `00010000`. ערך בינארי זה שקול לערך `16` בבסיס עשרוני, והוא זה שיודפס למסך.",
  },
  {
    code: `void main() {

    unsigned char num1 = 0xF5, num2 = 0xB8;
    unsigned char mask = 0x01, result = 0;
    
    for (int i = 0; i < 8; i++) {

        if ((num1 & mask) | (num2 & mask))
            result |= mask;

        mask <<= 1;
    }

    printf("%x\\n", result);
}`,
    question: "מה יהיה הפלט של התוכנית הבאה?",
    answers: ["fd", "b0", "02", "fe", "כל התשובות האחרות אינן נכונות"],
    correct: 0,
    hint: "הלולאה עוברת על כל 8 הביטים של הבייט. שימו לב לתנאי בתוך ה-`if`: מה המשמעות של פעולת ה-OR `|` בין שתי תוצאות של AND בינארי? איזו פעולה בינארית פשוטה יותר הקוד הזה מממש?",
    explanation:
      "הלולאה בקוד עוברת על כל שמונה הביטים של שני המספרים, `num1` ו-`num2`, מימין לשמאל. בכל איטרציה, התנאי `if` בודק אם הביט הנוכחית דולקת (שווה ל-1) בלפחות אחד משני המספרים. אם כן, הביט המתאימה במיקומה במשתנה `result` נדלקת גם היא. למעשה, הקוד מממש פעולת `OR` בינארית בין שני המספרים.\n\nהערכים הנתונים הם `num1 = 0xF5` (בבינארית `11110101`) ו-`num2 = 0xB8` (בבינארית `10111000`). ביצוע פעולת `OR` בינארית עליהם ייתן את התוצאה הבאה: `11110101 | 10111000 = 11111101`. הערך הבינארי `11111101` בבסיס הקסדצימלי הוא `fd`.",
  },
  {
    code: `unsigned short func(unsigned short s, int n) {
    return s << n | s >> 16-n;
}

void main() {
    unsigned short x = 0x1357;
    printf("%x", func((x, 3) );
}`,
    question:
      "בהנחה ש־unsigned short הוא בגודל של שני בתים (16 ביטים), מהו הפלט של התכנית הבאה?",
    answers: ["9ab8", "ab89", "3571", "7135", "כל התשובות האחרות אינן נכונות"],
    correct: 0,
    hint: "שימו לב לסדר קדימויות האופרטורים בביטוי `s >> 16-n`. פעולת החיסור מתבצעת לפני פעולת ההזזה ימינה. מה מטרת הביטוי הזה בשילוב עם הביטוי `s << n`?",
    explanation:
      "הפונקציה `func` מבצעת פעולת הזזה מעגלית שמאלה (circular left shift). כלומר, ביטים ש'נופלות' מהצד השמאלי של המספר, 'חוזרות' ומופיעות בצד הימני.\n\nהערך ההתחלתי של `x` הוא `0x1357`, שבייצוג בינארי של 16 ביטים הוא `0001001101010111`. הפונקציה נקראת עם `n=3`.\n1. החלק הראשון, `s << 3`, מזיז את כל הביטים 3 מקומות שמאלה. התוצאה היא `1001101010111000`.\n2. החלק השני, `s >> 16-3` (כלומר `s >> 13`), נועד לקחת את 3 הביטים המשמעותיות ביותר המקוריות של `s` (שהן `000`) ולהזיז אותן לקצה הימני. התוצאה היא `0000000000000000`.\n3. פעולת `OR` מאחדת בין שתי התוצאות: `1001101010111000 | 0000000000000000` נותן `1001101010111000`. בבסיס הקסדצימלי, ערך זה הוא `9ab8`.",
  },
  {
    code: `void main() {
    unsigned short x = 0xffff;
    printf("%x\\n", (x >> 3) & 0xf0f0 );
}`,
    question:
      "בהנחה ש־unsigned short הינו בגודל של שני בתים בזיכרון, מהו הפלט של התכנית הבאה:",
    answers: ["10f0", "00f0", "00ff", "10ff", "כל התשובות האחרות אינן נכונות"],
    correct: 0,
    hint: "בצעו את הפעולות הבינאריות לפי הסדר. ראשית, בצעו את פעולת ההזזה ימינה על `x`, ורק לאחר מכן בצעו את פעולת ה-`AND` עם המסכה הנתונה. זכרו ש־`x` הוא משתנה מסוג `unsigned`.",
    explanation:
      "המשתנה `x` מאותחל לערך `0xffff`, שבייצוג בינארי של 16 ביטים הוא `1111111111111111`. הפעולה הראשונה היא הזזת הביטים 3 מקומות ימינה (`x >> 3`). מאחר ש־`x` הוא `unsigned`, יוכנסו אפסים משמאל. התוצאה לאחר ההזזה היא `0001111111111111`.\n\nהשלב הבא הוא פעולת `AND` בינארית בין תוצאת ההזזה לבין המסכה `0xf0f0` (שבבינארית היא `1111000011110000`). החישוב `0001111111111111 & 1111000011110000` מניב את התוצאה `0001000011110000`. ערך בינארי זה, כאשר ממירים אותו לבסיס הקסדצימלי, הוא `10f0`.",
  },
  {
    code: `void f() {
    unsigned int c = 0xF3AE8366;
    unsigned int x = 0xFFFFFFFF;

    for (int i = 31; i >= 0; i--)
        if (c & (1 << i))
            x &= ~(1 << (31 - i));

    printf("%X\\n", x);
}`,
    question:
      "בהנחה ש־unsigned int הינו בגודל של 4 בתים, מהו הפלט של התכנית הבאה?",
    answers: [
      "993E8A30",
      "C517C99",
      "C517C98",
      "993E8A31",
      "C518C98",
      "כל התשובות האחרות אינן נכונות",
    ],
    correct: 0,
    hint: "הקוד סורק את הביטים של `c` מהמשמעותי ביותר (MSB) לנמוך ביותר (LSB). שימו לב מה קורה למשתנה `x` כאשר ביט כלשהו ב־`c` דלוק. איזו פעולה לוגית כוללת הקוד מבצע על הביטים של `c`?",
    explanation:
      "הלולאה עוברת על הביטים של המספר `c` משמאל לימין (מהביט ה-31 ועד ל-0). המשתנה `x` מתחיל כשכל הביטים שלו דלוקים (`0xFFFFFFFF`). בכל איטרציה, הקוד בודק את הביט במיקום `i` של `c`. אם הביט הזה דלוק, הקוד מכבה את הביט המקביל לו מהצד השני (במיקום `31-i`) במשתנה `x`.\n\nלדוגמה, כאשר `i` הוא 31 (הביט הכי שמאלי ב-`c`), אם הוא דלוק, הקוד יכבה את הביט במיקום `31-31=0` (הביט הכי ימני) ב-`x`. כאשר `i` הוא 30, אם הוא דלוק, הקוד יכבה את הביט במיקום `31-30=1` ב-`x`, וכן הלאה.\n\nהפעולה הזו שקולה לביצוע `NOT` על היפוך סדר הביטים של `c`. הערך של `c` הוא `0xF3AE8366`, ולאחר היפוך סדר הביטים וביצוע `NOT`, מתקבלת התוצאה הסופית `0x993E8A30`.",
  },
  {
    code: `char bitTrans(char x) {

    char y = 0xff;

    for (int i = 7; i >= 0; i--)
        if (x & (1<<i))
            y &= ~(1<<(7-i));

    return ~y;
}`,
    question: "בהינתן קלט `x`, מה מחזירה הפונקציה `bitTrans`?",
    answers: [
      "ערך שהוא תמונת ראי של הביטים של `x`",
      "את הערך `x` ללא שינוי",
      "ערך שהוא המשלים של תמונת הראי של הביטים של `x`",
      "את המשלים של `x`",
      "כל התשובות האחרות אינן נכונות",
    ],
    correct: 0,
    hint: "עקבו אחר הערך של המשתנה `y` לאורך ריצת הלולאה. שימו לב כיצד ביט דלוק במיקום `i` במשתנה הקלט `x` משפיע על הביט במיקום `7-i` במשתנה `y`. לבסוף, אל תשכחו את הפעולה האחרונה שמבוצעת על `y` לפני ההחזרה.",
    explanation:
      "הפונקציה מקבלת תו `x` ומאתחלת משתנה נוסף `y` כשכל הביטים שלו דלוקים (`0xff`). הלולאה סורקת את הביטים של `x` מהבכיר (7) לזוטר (0). אם ביט מספר `i` ב־`x` דלוק, הקוד מכבה את הביט המשלים `7-i` במשתנה `y`.\n\nבסוף הלולאה, המשתנה `y` מכיל ערך שבו כל ביט `j` הוא ההיפך (NOT) של הביט המקורי `i` של `x`, כאשר `j = 7-i`. במילים אחרות, `y` הוא למעשה `NOT` של היפוך סדר הביטים של `x`. כלומר, `y` שווה ל-`~(reverse(x))`.\n\nהפקודה האחרונה בפונקציה היא `return ~y;`. היא מחזירה את המשלים הבינארי של `y`. אם נציב את מה שחישבנו, הפונקציה מחזירה `~(~(reverse(x)))`. פעולת `NOT` כפולה מבטלת את עצמה, ולכן הערך הסופי המוחזר הוא `reverse(x)` - כלומר, תמונת הראי של הביטים של `x`.",
  },
  {
    code: `#define MAX(X,Y) ( (X) > (Y) ? (X) : (Y) )

void f2(void) {

    int a = 5, b = 9;

    for (int i = 0;(i<<2) < MAX(i+9,b) ; i++)
        printf("i=%d\\n", i);
}`,
    question: "כמה איטרציות תבצע הלולאה?",
    answers: ["3", "0", "1", "2", "4", "אף תשובה אינה נכונה"],
    correct: 0,
    hint: "עקבו אחר ערכו של `i` בכל איטרציה. שימו לב כיצד שני צידי תנאי העצירה (`(i<<2)` והתוצאה של `MAX`) משתנים עם כל ריצה של הלולאה.",
    explanation:
      "כדי לקבוע את מספר האיטרציות, נעקוב אחר תנאי הלולאה `(i<<2) < MAX(i+9,b)` כאשר `b` שווה ל-9.\n\n* **כאשר i = 0:** התנאי הוא `(0<<2) < MAX(9,9)`, כלומר `0 < 9`. התנאי מתקיים.\n* **כאשר i = 1:** התנאי הוא `(1<<2) < MAX(10,9)`, כלומר `4 < 10`. התנאי מתקיים.\n* **כאשר i = 2:** התנאי הוא `(2<<2) < MAX(11,9)`, כלומר `8 < 11`. התנאי מתקיים.\n* **כאשר i = 3:** התנאי הוא `(3<<2) < MAX(12,9)`, כלומר `12 < 12`. התנאי אינו מתקיים והלולאה מסתיימת.\n\nהלולאה רצה עבור `i` בערכים 0, 1 ו-2, ולכן היא מבצעת 3 איטרציות בסך הכל.",
  },
  {
    code: `typedef unsigned char BYTE;

void func() {

    BYTE mask1 = 0x88, mask2 = 0x55, temp;
    unsigned short int num = 0x1234, res = 0;

    for (int i = 0; i < 2; i++) {
    
        res <<= 8;
        temp = num >> (i * 8);

        if (i % 2 == 0)
            temp ^= mask2;
        else
            temp ^= mask1;

        res |= temp;
    }

    printf("%X\\n", res);
}`,
    question: "מה יהיה הפלט של הפונקציה `func`?",
    answers: [
      "כל התשובות האחרות אינן נכונות",
      "`619A`",
      "`1400`",
      "`BC47`",
      "`759A`",
    ],
    correct: 1,
    hint: "הלולאה רצה פעמיים, עבור כל בית של המשתנה `num`. בכל פעם, היא מבודדת בית אחר ומבצעת עליו פעולת `XOR` עם מסכה שונה, בהתאם לאינדקס הלולאה.\n\nשימו לב: בלולאה הראשונה, מתבצעת השמה של המשתנה `num` שגודלו 2 בתים, לתוך המשתנה `temp` שגודלו בית אחד. במקרה זה, מועתק רק הבית הימני.",
    explanation:
      "באיטרציה הראשונה של הלולאה (`i=0`), הקוד מבודד את הבית התחתון של `num`, שהוא `0x34`. מכיוון ש־`i` הוא זוגי, מתבצעת על הבית פעולת `XOR` עם `mask2` (שהוא `0x55`). התוצאה של `0x34 ^ 0x55` היא `0x61`. ערך זה נשמר כרגע בתוצאה `res`.\n\nבאיטרציה השנייה (`i=1`), הערך הקודם ב-`res` (`0x61`) מוזז 8 ביטים שמאלה והופך ל-`0x6100`. כעת הקוד מבודד את הבית העליון של `num`, שהוא `0x12`. מכיוון ש־`i` אי־זוגי, מתבצעת פעולת `XOR` עם `mask1` (שהוא `0x88`). התוצאה של `0x12 ^ 0x88` היא `0x9A`.\n\nלבסוף, התוצאה החדשה (`0x9A`) משולבת עם `res` באמצעות פעולת `OR`, ליצירת הערך הסופי: `0x6100 | 0x9A = 0x619A`. זהו הערך המודפס למסך.",
  },
];
