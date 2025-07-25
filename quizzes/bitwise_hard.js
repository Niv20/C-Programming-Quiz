const quizData = [
  {
    code: `unsigned char BuildMask(int size) {

    unsigned char mask = 0;

    for (int i = 0; i < size; i++) {
        mask = mask << 1;
        mask = mask | 1;
    }

    return mask;
}

unsigned char f(unsigned char c, int size) {

    unsigned char mask = BuildMask(size);

    c = ((c & mask) << (8-size)) | ((c & ~mask) >> size);
    return c;
}`,
    question:
      "מה מבצעת הפונקציה `f` שמקבלת `c` ו־`size` (בהינתן ש-`size` הוא מספר בין 1 ל-7 כולל) על המשתנה `c`?",
    answers: [
      "דוחפת את `8-size` הביטים התחתונים `size` מקומות שמאלה",
      "דוחפת את `size` הביטים התחתונים `8-size` מקומות שמאלה",
      "מחליפה בין `size` הביטים התחתונים ל־`8-size` הביטים העליונים",
      "יתר התשובות אינן נכונות",
      "מחליפה בין `size` הביטים העליונים ל־`8-size` הביטים התחתונים",
    ],
    correct: 2,
    hint: "נתחו את שני חלקי הביטוי שמימין להשמה בנפרד. החלק הראשון, `(c & mask)`, מבודד קבוצת ביטים מסוימת ומזיז אותה. החלק השני, `(c & ~mask)`, מבודד את קבוצת הביטים הנותרת ומזיז אותה. מהי הפעולה הכוללת שמתקבלת מאיחוד שתי התוצאות?",
    explanation:
      "הפונקציה `f` מבצעת החלפה בין שתי קבוצות של ביטים ב־`c`.\n\nהפונקציה `BuildMask` יוצרת מסכה עם `size` ביטים דלוקים מימין. הביטוי `(c & mask)` מבודד את `size` הביטים התחתונים של `c`. לאחר מכן, `<< (8-size)` מזיז את הביטים הללו לקצה השמאלי (העליון) של התוצאה.\n\nבמקביל, הביטוי `(c & ~mask)` מבודד את `8-size` הביטים העליונים של `c`. לאחר מכן, `>> size` מזיז את הביטים הללו לקצה הימני (התחתון) של התוצאה.\n\nפעולת ה־`OR` (`|`) מאחדת את שתי התוצאות, ובכך משלימה את פעולת ההחלפה: `size` הביטים שהיו למטה עברו למעלה, ו־`8-size` הביטים שהיו למעלה עברו למטה.",
  },
  {
    code: ``,
    question: "מה יהיה ערך הביטוי:\n`1 >> 1 << 1 ^ 1 >> 1 >> 1 `",
    answers: ["`4`", "`2`", "`1`", "`0`", "כל התשובות האחרות אינן נכונות"],
    correct: 0,
    hint: "כדי לפתור את השאלה, יש לפעול לפי סדר קדימויות האופרטורים. אם אינכם זוכרים את סדר הקדימויות, הכל בסדר, הוא מופיע בעמוד האחרון של דף הנוסחאות המעודכן.",
    explanation:
      "החישוב מתבצע לפי כללי קדימויות האופרטורים. להזזת הביטים `<<` ו־`>>` יש קדימות גבוהה יותר מאשר לאופרטור `^`. לכן, בעצם צריך לחשב את הביטוי באופן הבא: `(1<<1<<1) ^ (1>>1<<1)`.\n- החלק השמאלי: `1<<1` נותן `2`, ולאחר מכן `2<<1` נותן `4`.\n- החלק הימני: `1>>1` נותן `0`, ולאחר מכן `0<<1` נותן `0`.\n\nלבסוף, מתבצעת פעולת ה־`XOR` בין התוצאות של שני האגפים: `4^0`, שזה שווה ל־`4`.",
  },
  {
    code: ``,
    question:
      "מה תבצע השורה הבאה על משתנה `x` בגודל בית אחד:\n`x = (~(1 << (7-i)) & x)`\n\n(הביטים ממוספרים מ־0, וימין נחשב ל־lsb)",
    answers: [
      "תכבה את הביט ה־i משמאל",
      "תדליק את הביט ה־i משמאל",
      "תכבה את הביט ה־i מימין",
      "כל התשובות האחרות אינן נכונות",
      "תדליק את הביט ה־i מימין",
    ],
    correct: 0,
    hint: "הביטוי `1 << k` יוצר מסכה עם ביט בודד דלוק במיקום `k`. פעולת `NOT` (`~`) הופכת את המסכה הזו למסכה עם ביט בודד כבוי. בדקו היטב איזה מיקום `k` מחושב כאן - האם זה `i` או `7-i`?",
    explanation:
      "הביטוי `(1 << (7-i))` יוצר מסכה עם ביט `1` בודד במיקום ה־`i` משמאל. לדוגמה, עבור `i=0`, הביטוי הוא `1 << 7`, והביט הדלוק הוא במיקום 7, שהוא הביט הכי שמאלי (MSB).\n\nפעולת ה־`NOT` (`~`) הופכת את המסכה, כך שנוצרת מסכה חדשה עם ביט `0` בודד במיקום ה־`i` משמאל, וביטים של `1` בכל שאר המקומות.\n\nלבסוף, פעולת `AND` בין `x` למסכה זו שומרת על כל הביטים המקוריים של `x`, אך מאפסת (מכבה) את הביט ה־`i` משמאל.",
  },
  {
    code: `#define Q1(X) ((((X)^0x55555555)<<1)&0xAAAAAAAA) ^ ((X)^0xAAAAAAAA)

#define Q2(X) ((((X)&0x55555555)<<1)&0xAAAAAAAA) ^ ((X)^0xAAAAAAAA)

#define Q3(X) ((((X)^0x55555555)<<1)&0xAAAAAAAA) ^ ((X)&0xAAAAAAAA)

#define Q4(X) ((((X)^0x55555555)<<1)&0xAAAAAAAA) & ((X)^0xAAAAAAAA)`,
    question:
      "מעוניינים במאקרו אשר מחזיר ערך שונה מאפס אם הביטים במקומות הזוגיים (מיקום ה־`LSB` הוא 0) של משתנה `X` שווים ל־`bitwise not` של הביטים במקומות האי־זוגיים שלו, ומחזיר אפס אחרת. בהינתן ארבעת המאקרואים שמשמאל, ובהנחה ש־`X` הוא בגודל 4 בתים, איזו טענה היא הנכונה ביותר?",
    answers: [
      "אף תשובה מהתשובות האחרות אינה נכונה",
      "שתי תשובות או יותר מהאחרות נכונות",
      "רק `Q1` מבצע את הדרוש",
      "רק `Q2` מבצע את הדרוש",
      "רק `Q3` מבצע את הדרוש",
      "רק `Q4` מבצע את הדרוש",
    ],
    correct: 0,
    hint: "בשאלה אומרים לנו ש־`x` הוא בגודל 4 בתים, אבל בתכלס', מכיוון שהמסכות `0x55555555` ו־`0xAAAAAAAA` בנויות מדפוסים של שני ביטים החוזרים על עצמם, נוכל לבחון את התנהגות המאקרו על משתנה בגודל קטן יותר, והדפוסים שנגלה יהיו תקפים עבור הגודל המלא.\nלכן, במקום להריץ את כל אחד מהמקרואים עם ערך מפלצתי בגודל 4 בתים, אפשר להריץ אותו עם ערכים קטנים יותר. הערך הכי קטן שאנחנו מכירים הוא בגודל בית אחד (תו), אבל למעשה נוכל להקל על עצמנו עוד יותר בכך שניקח ערך אפילו יותר קטן בעל 4 ביטים בלבד. נסמן את ארבעת הביטים באופן כללי ב־`abcd`, כאשר `b` ו־`d` יהיו הנציג של הזוגיים ו־`a` ו־`c` יהיו הנציג של האי־זוגיים. מה שהמאקרו יעשה לשני הנציגים הזוגיים - יקרה לכל הביטים הזוגיים שבמספר, ובאופן דומה כל מה שהמאקרו יעשה לשני הנציגים האי־זוגיים - יקרה לכל הביטים האי־זוגיים.\n(למקרה שאתם תוהים לעצמכם: אפשר להסתפק רק בשלושה ביטים, אבל זה לא סימטרי, וזה קצת מוזר. לא לקחתי שני ביטים, כי אז בהזזה של 1 שמאלה הייתי מאבד את הנציג האי־זוגי.)",
    explanation:
      "בהמשך למה שכתבתי ברמז, נריץ את פעולת המאקרואים עבור ערך בעל 4 ביטים `abcd`, כאשר `a` הוא הביט המשמעותי ביותר ו־`d` הוא הפחות משמעותי. נסמן את הביט ההופכי של `a` ב־`<span class='overline'>a</span>` (כלומר, אם `a` הוא 0, אז `<span class='overline'>a</span>` הוא 1, ולהיפך).\nב־`Q1`: הערך השמאלי הוא `<span class='overline'>b</span>0<span class='overline'>d</span>0`. הערך הימני הוא `<span class='overline'>a</span>b<span class='overline'>c</span>d`. המאקרו מחזיר את ה־XOR בניהם. כזכור, XOR של אפס עם ביט כלשהו, שווה פשוט לאותו הביט. לכן, מספיק שאחד מהביטים שבמקומות הזוגיים יהיה 1, כדי שהמאקרו יחזיר תשובה שונה מאפס, וזה לא מה שאנחנו רוצים.\nב־`Q2`: הערך השמאלי הוא `b0d0`. הערך הימני הוא `<span class='overline'>a</span>b<span class='overline'>c</span>d`. המאקרו מחזיר את ה־XOR ביניהם. בדומה ל־`Q1`, גם כאן מספיק שאחד מהביטים שבמקומות הזוגיים יהיה 1, כדי שהמאקרו יחזיר תשובה שונה מאפס, וזה לא מה שאנחנו רוצים.\nב־`Q3`: הערך השמאלי הוא `<span class='overline'>b</span>0<span class='overline'>d</span>0`. הערך הימני הוא `a0c0`. המאקרו מחזיר את ה־XOR ביניהם. קל לראות שאם יש שני ביטים צמודים (זוגי ואי־זוגי) ששניהם בעלי אותו ערך, 0 או 1, אז המאקרו יחזיר תשובה שונה מאפס. שימו לב שזה לא מה שאנחנו צריכים. אנחנו רוצים שהוא יחזיר תשובה שונה מאפס דווקא כאשר הם בעלי ערכים הפוכים.\nב־`Q4`: הערך השמאלי הוא `<span class='overline'>b</span>0<span class='overline'>d</span>0`. הערך הימני הוא `<span class='overline'>a</span>b<span class='overline'>c</span>d`. המאקרו מחזיר את ה־AND ביניהם. קל לראות שאם יש שני ביטים צמודים (זוגי ואי־זוגי) ששניהם 0, אז המאקרו יחזיר תשובה שונה מאפס, וזה לא מה שאנחנו רוצים.",
  },
  {
    code: ``,
    question:
      "נתון משתנה `a` בגודל בית, המכיל 3 ערכים במבנה:\n`XXXYYYYZ`\nמעוניינים להחליף בין שלושת הביטים `XXX` לארבעת הביטים `YYYY` כך שהמספר שיתקבל יהיה:\n`YYYYXXXZ`\nאיזה מהפקודות הבאות יבצעו את הפעולה?",
    answers: [
      "`a = ((a>>5) << 1) | ((a<<1) << 4);`",
      "`a = ((a<<5) >> 1) | ((a>>1) << 4);`",
      "`a = ((a>>5) << 1) | ((a<<1) >> 4);`",
      "`a = ((a<<5) >> 1) | ((a<<1) >> 4);`",
      "אף אחת מהתשובות אינה נכונה",
    ],
    correct: 4,
    hint: "כדי להחליף קבוצות של ביטים, יש לבודד כל קבוצה בנפרד, להזיז אותה למיקום החדש שלה, ורק אז לאחד את כל החלקים. בדקו האם הפקודות המוצעות מצליחות לבודד נכונה את קבוצות הביטים `XXX` ו־`YYYY` לפני שהן מזיזות אותן.",
    explanation:
      "אף אחת מהאפשרויות המוצעות אינה מבצעת את הפעולה כראוי. כולן מנסות להזיז את המספר `a` כולו, מבלי לבודד תחילה את קבוצות הביטים, דבר הגורם לביטים מקבוצה אחת 'לגלוש' ולהשפיע על קבוצות אחרות.\n\nהדרך הנכונה לבצע את ההחלפה היא באמצעות שלוש פעולות נפרדות שמאוחדות לבסוף. ראשית, יש לבודד כל קבוצת ביטים באמצעות `AND`, להזיז אותה למיקומה החדש, ולבסוף לאחד את כל החלקים עם `OR`. הפקודה הנכונה תהיה: `a = ((a&0xE0)>>4) | ((a&0x1E)<<3) | (a&0x01);`.\n\nהביטוי `((a & 0xE0) >> 4)` ממסך את שלושת הביטים העליונים `XXX` בעזרת המסכה `0xE0` (שזו `11100000`), ואז מזיז אותם 4 ביטים ימינה כדי למקם אותם במקום של `YYYY`.\n\nהביטוי `((a & 0x1E) << 3)` ממסך את ארבעת הביטים האמצעיים `YYYY` בעזרת `0x1E` (`00011110`), ואז מזיז אותם 3 ביטים שמאלה כדי שיגיעו לעמדת `XXX`.\n\nהביטוי האחרון `(a & 0x01)` שומר את הביט התחתון Z כפי שהוא.\n\nאיחוד של שלושת הביטויים האלה באמצעות האופרטור `OR` מביא את התשובה הנכונה.",
  },
  {
    code: ``,
    question:
      "נתון משתנה `x` מטיפוס `unsigned short` שגודלו שני בתים וארוזים בו שלושה ערכים על פי המבנה הבא:\n`XXXXXYYYYYYZZZZZ`\nמעוניינים להחליף בין חמשת הביטים `XXXXX` לששת הביטים `YYYYYY` כך שיתקבל המבנה:\n`YYYYYYXXXXXZZZZZZ`\nאיזו מהפקודות הבאות תבצע את הפעולה?",
    answers: [
      "`x = ((x>>11)<<5) | ((x>>5)<<10) | (x & 0x1F);`",
      "`x = ((x>>11)<<5) | (((x>>5) & 0x3F)<<10) | (x & 0x1F);`",
      "`x = ((x & 0xF800) >> 5) | ((x & 0x07E0) << 6) | (x & 0x1F);`",
      "`x = ((x>>11)<<5) | (((x>>5) & 0x1F)<<10) | (x & 0x1F);`",
      "`x = ((x>>11)<<5) | (((x>>5) & 0x3F)<<10) & (x & 0x1F);`",
      "אף אחת מהתשובות אינה נכונה",
    ],
    correct: 1,
    hint: "המפתח לפתרון הוא לבודד את `XXXXX`, `YYYYYY` ו־`ZZZZZ` בעזרת הזזות ומסכות בינאריות, ואז להרכיב אותם מחדש בסדר הנכון.\n\nשימו לב אילו מהתשובות משתמשות במסכה כדי לחלץ בדיוק שישה ביטים לשדה של `YYYYYY` — לא פחות ולא יותר. בדקו איך כל שדה מוזז: האם `XXXXX` באמת מגיע למקום של `YYYYYY` ולהפך? ולבסוף, ודאו שהשדה התחתון `ZZZZZ` נשאר בדיוק במקומו בלי להשתנות.",
    explanation:
      "הפתרון הנכון דורש בידוד, הזזה, ואיחוד של כל אחד משלושת חלקי המידע בנפרד. נפרק את הביטוי הנכון:\n\n`(x & 0x1F)`: חלק זה מבודד את 5 הביטים הנמוכים (`ZZZZZ`) ומשאיר אותם במקומם.\n`((x>>11)<<5)`: חלק זה מבודד את 5 הביטים הגבוהים (`XXXXX`) על ידי הזזתם 11 מקומות ימינה (מה שמשאיר `00...XXXXX`), ואז מזיז אותם 5 מקומות שמאלה כדי למקם אותם במקום החדש (ביטים 9 עד 5).\n`(((x>>5) & 0x3F)<<10)`: זהו החלק המורכב. `(x>>5)` מזיז את הביטים הרצויים (`YYYYYY`) לקצה הימני, אך משאיר את `XXXXX` לפניהם. פעולת ה־`& 0x3F` חיונית כדי למחוק את ביטי ה־`XXXXX` ולהשאיר רק את 6 הביטים של `YYYYYY`. לבסוף, `<<10` מזיז אותם למקומם החדש והרצוי (ביטים 15 עד 10).\n\nאיחוד שלושת החלקים עם `OR` נותן את התוצאה המבוקשת.",
  },
  {
    code: ``,
    question:
      "מעוניינים לקחת `unsigned short int` בשם `num` ולשנות את הבית ה־`least significant` שלו כך שארבעת הביטים ה־`most significant` של בית זה יהיו `C` (בבסיס 16), בעוד שאר הביטים ישמרו על ערכם המקורי.\nאיזו מהשורות הבאות תבצע את המשימה?",
    answers: [
      "`num = (num & 0xFFCF) & 0x00C0;`",
      "`num = (num & 0x00C0) & 0x00F0;`",
      "`num = (num & 0xFF0F) & 0x00C0;`",
      "`num = (num & 0x00C0) & 0xFF0F;`",
      "כל התשובות האחרות אינן נכונות",
    ],
    correct: 4,
    hint: "כאשר מדברים על least significant מתכוונים לחלקים במספר שתורמים פחות לערך הכולל שלו, אלו שמייצגים משקלים נמוכים יותר. לעומת זאת, most significant מתייחס לחלקים שתורמים יותר לערך, בעלי המשקל הגבוה יותר.\n\nכדי לענות על השאלה, חשבו תחילה: איזה בית מבין שני הבתים של `num` נחשב לפחות משמעותי? ובתוכו, אילו ארבעה ביטים נחשבים למשמעותיים יותר?\n\nהפעולה הנדרשת מורכבת משני שלבים: ראשית, איפוס הביטים שאותם רוצים לשנות (מבלי לפגוע באחרים), ושנית, 'הדלקת' הביטים החדשים במיקומם. איזו פעולה בינארית משמשת לאיפוס, ואיזו להדלקה?",
    explanation:
      "הדרך הנכונה לבצע את המשימה היא בשני שלבים: איפוס ארבעת הביטים הרלוונטיים, ולאחר מכן קביעת הערך החדש שלהם. הפקודה הנכונה אמורה להיות `num = (num & 0xFF0F) | 0x00C0;`. אף אחת מהתשובות המוצגות אינה מבצעת זאת.\n\nרוב התשובות המוצעות משתמשות בפעולת `AND` כפולה. פעולת `AND` יכולה רק לכבות ביטים, ולכן לא ניתן להשתמש בה כדי לקבוע את הערך החדש `C`. לדוגמה, שימוש בביטוי `& 0x00C0` בסוף הפעולה יאפס את כל הביטים במספר פרט לאלו שדולקים במסכה, וזו אינה המטרה. בתשובה אחרת, השימוש במסכה `& 0xFF0F` מאפס נכונה את ארבעת הביטים הרלוונטיים, אך לאחריו לא מתבצעת פעולת ה־`OR` הנדרשת כדי לקבוע את הערך החדש `C`.",
  },
  {
    code: `void printInBinary1(unsigned char n) {

    unsigned char mask = 0x80;

    while (mask) {

        if (n & mask)
            printf("1");
        else
            printf("0");

        mask >>= 1;
    }
}


void printInBinary2(unsigned char n) {

    while (n) {

        if (n & 128)
            printf("1");
        else
            printf("0");

        n <<= 1;
    }
}


void printInBinary3(unsigned char n) {

    int i = 0;

    while (n) {

        if (n & 128)
            printf("1");
        else
            printf("0");

        n <<= 1;
        i++;
    }

    for ( ; i < 8*sizeof(unsigned char); i++)
        printf("0");
}


void printInBinary4(unsigned char n) {

    int mask = 0x80, i=0;

    while (mask) {

        if (n & mask)
            printf("1");
        else
            printf("0");

        mask >>= 1;
        i++;
    }

    for ( ; i < 8*sizeof(unsigned char); i++)
        printf("0");
}`,
    question:
      "נרצה לכתוב פונקציה המקבלת `char` ומדפיסה את הביטים שלו כך שה־`MSB` יופיע משמאל וה־`LSB` יופיע מימין. הוצעו 4 מימושים שונים לפונקציה. איזה מימוש יבצע את הנדרש?",
    answers: [
      "שתיים או יותר מהתשובות האחרות נכונות",
      "`printInBinary3`",
      "`printInBinary2`",
      "`printInBinary4`",
      "`printInBinary1`",
      "אף תשובה אחרת אינה נכונה",
    ],
    correct: 0,
    hint: "בחנו כל פונקציה בנפרד: האם היא מבטיחה לעבור תמיד על כל 8 הביטים של המספר? שימו לב למקרה שבו הביטים הימניים הם 0 (נניח כמו 64). מה יקרה במקרה כזה?",
    explanation:
      "הפונקציה הראשונה, השלישית והרביעית יפיקו את הפלט הנכון, ולכן התשובה הנכונה היא 'שתיים או יותר מהתשובות האחרות נכונות'.\n\n`printInBinary1`: מימוש זה נכון. הוא משתמש במסכה שמתחילה מהביט המשמעותי ביותר (`MSB`) וזזה ימינה בכל איטרציה. הלולאה תמיד רצה 8 פעמים ומבטיחה שכל 8 הביטים יודפסו כראוי.\n`printInBinary2`: הפונקציה לא מדפיסה כראוי כי היא עוצרת את הלולאה כאשר הערך n הופך ל־0, מה שעלול לקרות לפני שעברנו על כל 8 הביטים של המשתנה. למשל, אם נכניס את הערך 64, שהייצוג הבינארי שלו הוא `01000000`, הפונקציה תדפיס רק `01` במקום כל 8 הספרות, כי אחרי שתי הזזות שמאלה n יתאפס והלולאה תיעצר.\n`printInBinary3`: מימוש זה נכון. הלולאה הראשונה מזיזה את ביטי הקלט שמאלה ומדפיסה אותם כל עוד נותרו ביטים דולקים, והלולאה השנייה משלימה באפסים את יתרת הביטים עד להדפסת 8 ביטים בסך הכל.\n`printInBinary4`: גם מימוש זה נכון מבחינת הפלט. הוא עובד כמו המימוש הראשון ומדפיס נכונה את כל 8 הביטים בלולאה הראשונה. שימו לב: הלולאה השנייה שנועדה להדפיס אפסים מיותרת ולעולם לא תתבצע, מפני שהלולאה הראשונה כבר מבצעת 8 איטרציות.",
  },
];
