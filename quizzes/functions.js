// עבר בדיקה
const quizData = [
  {
    code: `typedef struct _Student {
    unsigned long id;
    char *name;
    unsigned int grade;
} Student;

int cmpNames(void *p1, void *p2) {
    return (strcmp( [[1]] , [[2]] ));
}
    
void main() {

    // נתון מערך של מצביעים לסטודנטים
    Student **students;

    // ... המערך הוקצה, הנתונים הוכנסו ...

    // נתונה הקריאה הבאה לפונקציה
    cmpNames((students[5], students+10);
}`,
    question:
      "בהינתן הקוד והקריאה לפונקציה, מה יש למלא בתיבות 1 ו־2 כדי שהפונקציה תשלים כראוי את השוואת השמות המתאימים לפרמטרים `p1` ו־`p2`?",
    answers: [
      "[[1: ((Student*)p1)->name]][[2: (*((Student**)p2))->name]]",
      "[[1: (*((Student**)p1))->name]][[2: (*((Student**)p2))->name]]",
      "[[1: (**((Student**)p1)).name]][[2: (**((Student**)p2)).name]]",
      "[[1: ((Student*)p1)->name]][[2: ((Student*)p2).name]]",
      "אף תשובה מבין התשובות האחרות אינה נכונה",
    ],
    correct: 0,
    hint: "שימו לב היטב להבדל בין שני הארגומנטים המועברים לפונקציה. מהו הטיפוס של `students[5]` ומהו הטיפוס של `students+10`? לכל אחד מהם נדרשת דרך גישה שונה כדי להגיע לשדה `name`.",
    explanation:
      "הפתרון הנכון דורש הבנה מדויקת של טיפוסי המשתנים המועברים לפונקציה. המערך `students` הוא מצביע למצביע (`Student**`), לכן `students[5]` הוא מצביע לסטודנט (`Student*`), בעוד שהביטוי `students+10` הוא כתובת בתוך מערך המצביעים, וטיפוסו הוא מצביע למצביע (`Student**`).\n\nהפרמטר `p1` מקבל את `students[5]`, ולכן כדי לגשת לשם דרכו, יש לבצע המרה ל־`Student*` ולהשתמש באופרטור החץ. לכן, בתיבה 1 יש למלא את הביטוי `((Student*)p1)->name`.\n\nהפרמטר `p2` מקבל את `students+10`. כדי לגשת לשם דרכו, יש לבצע המרה ל־`Student**`, לבצע `dereference` אחד (`*`) כדי לקבל את המצביע `students[10]`, ורק אז להשתמש באופרטור החץ. לכן, בתיבה 2 יש למלא את הביטוי `(*((Student**)p2))->name`.",
  },
  {
    code: `typedef struct _Student {
    unsigned long id;
    char *name;
    unsigned int grade;
} Student;

int cmpNames( [[1]] p1, [[2]] p2 ) {
    return (strcmp( [[3]] , [[4]] ));
}
    
void main() {

    // נתון מערך של מצביעים לסטודנטים
    Student **students;

    // ... המערך הוקצה, הנתונים הוכנסו ...

    // נתונה הקריאה הבאה לפונקציה
    cmpNames((students[5], students+10);
}`,
    question:
      "מה יש למלא בתיבות 1, 2, 3 ו־4 כדי שהפונקציה תשווה בין שם הסטודנט שמוצבע מתא 10 במערך `students` לבין שם הסטודנט שמוצבע מתא 5?",

    answers: [
      "[[1: Student*]][[2: Student**]][[3: (*p2)->name]][[4: p1->name]]",
      "[[1: Student*]][[2: Student**]][[3: (*p1).name]][[4: (**p2).name]]",
      "[[1: Student**]][[2: Student*]][[3: p2->name]][[4: (*p1)->name]]",
      "[[1: Student*]][[2: Student*]][[3: p2.name]][[4: (*p1)->name]]",
      "[[1: Student*]][[2: Student**]][[3: p1->name]][[4: *p2.name]]",
      "יותר מתשובה אחת נכונה",
    ],
    correct: 5,
    hint: "התחילו בזיהוי הטיפוס המדויק של כל אחד מהארגומנטים המועברים לפונקציה: `students[5]` ו־`students+10`. לאחר שתגדירו את טיפוסי הפרמטרים בתיבות 1 ו־2, הגדרת הגישה לשדה `name` בתיבות 3 ו־4 תהיה פשוטה יותר.",
    explanation:
      'כדי לפתור את השאלה, יש לנתח את הטיפוסים של הערכים המועברים לפונקציה. הביטוי `students[5]` ניגש לתוכן התא החמישי במערך של מצביעים לסטודנטים, ולכן הוא מהטיפוס `Student*`. כלומר, הפרמטר `p1` צריך להיות `Student*`, וזה מה שנכתוב בתיבה 1.\n\nהביטוי `students + 10` מבצע אריתמטיקה על מצביע כפול (`Student**`) ומתקבל ממנו עדיין `Student**`. לכן, המשתנה `p2` צריך להיות מטיפוס `Student**`, וזה מה שנכתוב בתיבה 2.\n\nעכשיו נסתכל על תיבה 3. אנחנו רוצים לגשת לשם של הסטודנט שהתקבל בפרמטר `p1`, שמוגדר כ־`Student*`. יש לנו שתי דרכים שקולות לעשות זאת: דרך אופרטור החץ `p1->name`, או על ידי שימוש ב־dereference ואז נקודה: `(*p1).name`. שתיהן נכונות לגמרי מבחינה תחבירית ומביאות לאותו ערך.\n\nבתיבה 4 אנחנו רוצים לגשת לשם של הסטודנט שנמצא בכתובת שאליה מצביע `p2`, שמוגדר כ־`Student**`. כדי להגיע לשדה `name`, נוכל לבצע dereference אחד (`*p2`) ואז להשתמש באופרטור החץ: `(*p2)->name`, או לבצע dereference כפול (`**p2`) ואז לגשת בעזרת נקודה: `(**p2).name`. גם כאן שתי האפשרויות תקינות ושקולות.\n\nנשים לב שקיימות שתי תשובות שמציעות את שתי הדרכים הנ"ל, ולכן התשובה הנכונה היא שיש יותר מתשובה אחת נכונה.',
  },
  {
    code: `typedef struct {
    char* name;
    int serialNum;
    double price;
} Product;

int compare(void *a, void *b) {
    return strcmp( [[1]] , [[2]] );
}`,
    question:
      "בהינתן מערך `arr` של מצביעים למבנה `Product`, ושני המצביעים הבאים:\n`;void *a = &arr[0]`\n`;void *b = arr+1`\n\nמה יש למלא בתיבות 1 ו־2 בפונקציה `compare` כדי לבצע השוואה לקסיקוגרפית תקינה בין שמות המוצרים?",
    answers: [
      "[[1: (*((Product**)a))->name]][[2: (*((Product**)b))->name]]",
      "[[1: (**((Product**)a)).name]][[2: (**((Product**)b)).name]]",
      "[[1: ((Product*)a)->name]][[2: ((Product*)b)->name]]",
      "[[1: (*(Product*)a).name]][[2: (*(Product*)b).name]]",
      "יותר מתשובה אחת נכונה",
      "אף אחת מהתשובות אינה נכונה",
    ],
    correct: 4,
    hint: "חשבו היטב מהו הטיפוס האמיתי של המשתנים `a` ו־`b`. הם מוגדרים כ־`void*`, אך לאיזה סוג של נתון הם למעשה מצביעים? הבנת רמות ההצבעה היא המפתח לפענוח ההמרה והגישה הנכונה לשדה `name`.",
    explanation:
      "המשתנה `arr` הוא מערך שכל איבר בו הוא מצביע למוצר (`Product*`), ולכן `arr` עצמו הוא מטיפוס `Product**`. המשתנים `a` ו־`b` מקבלים כתובות של איברים במערך זה, ולכן שניהם למעשה מצביעים למצביע למוצר (כלומר, הטיפוס האמיתי שלהם הוא `Product**`).\n\nכדי לגשת לשדה `name` מתוך מצביע `void*` שמייצג `Product**`, ישנן שתי דרכים נכונות ושקולות:\n1.  **דרך אופרטור החץ (`->`):** מבצעים המרה ל־`Product**`, מבצעים `dereference` אחד (`*`) כדי לקבל `Product*`, ומשתמשים באופרטור החץ כדי לגשת לשדה. הביטוי המתקבל הוא `(*((Product**)a))->name`.\n2.  **דרך אופרטור הנקודה (`.`):** מבצעים המרה ל־`Product**`, מבצעים `dereference` כפול (`**`) כדי להגיע ישירות למבנה המוצר עצמו, ואז ניגשים לשדה באמצעות אופרטור הנקודה. הביטוי המתקבל הוא `(**((Product**)a)).name`.\n\nמכיוון ששתי האפשרויות הראשונות מציגות את שתי הדרכים הנכונות, התשובה המדויקת ביותר היא 'יותר מתשובה אחת נכונה'.",
  },
  {
    code: `void sort(void *arr, int len, int elmSize, 
                        int (*cmp)(void *, void *)) {

    void *cur, *next, *tmp;

    for (int i = len - 1; i > 0; i--) {
        for (int j = 0; j < i; j++) {

            cur = (void *)((char *)arr + j * elmSize);

            [[1]]

            if ( (*cmp)(cur, next) > 0)
                /* swap אלגוריתם */

        }
    }
}`,
    question:
      "מהו קטע הקוד שיש למלא בתיבה 1 כדי לחשב נכונה את כתובת האיבר הבא לצורך ההשוואה בפונקציית המיון?",
    answers: [
      "[[1: next = (void *)((char *)cur + elmSize);]]",
      "[[1: next = (void *)((char *)arr + (j+1)*elmSize);]]",
      "[[1: tmp = ((char *)arr + elmSize);\nnext = (void *)(&(tmp[arr]));]]",
      "[[1: tmp = (char *)arr;\nnext = (void *)( tmp[(j+1)*elmSize] );]]",
      "אף אחת מהתשובות לא נכונה",
      "יש יותר מתשובה אחת נכונה",
    ],
    correct: 5,
    hint: "במיון בועות משווים כל איבר עם האיבר שבא אחריו. הקוד כבר חישב את כתובת האיבר הנוכחי (`cur`), ועלינו להשלים את חישוב כתובת האיבר הבא (`next`).",
    explanation:
      "תחילה, נפסול את שתי התשובות המשתמשות במשתנה `tmp`. משתנה זה הוא מטיפוס `void*`, שעליו לא ניתן לבצע פעולת אינדוקס באמצעות סוגריים מרובעים `[]`. ניסיון לעשות זאת הוא פעולה לא חוקית בשפת־C ויוביל לשגיאת קומפילציה.\n\nכעת נבחן את שתי התשובות הנותרות. אפשרות אחת היא לקחת את הכתובת של האיבר הנוכחי (`cur`), להוסיף לה את גודל האיבר (`elmSize`), ובכך לקבל באופן ישיר ויעיל את הכתובת של האיבר הבא.\n\nאפשרות נוספת היא לחשב את הכתובת של האיבר הבא (`j+1`) על ידי חישוב ההיסט המלא מתחילת המערך (`arr`). גם דרך זו מגיעה לאותה תוצאה נכונה מבחינה לוגית.\n\nמכיוון ששתי הדרכים נכונות, התשובה המדויקת ביותר היא שיש יותר מתשובה אחת נכונה.",
  },
  {
    code: `typedef void(*Func)(void*);

int count = 0;

void main() {
    foo1(foo1);
    foo1(foo2);
}

void foo1(void* f) {
    printf("foo1 ");
    count++;
    
    if (f == foo1 || count == 4)
        return;
    
    ((Func)f)(foo1);
}

void foo2(void* f) {
    printf("foo2 ");
    count++;

    if (f == foo2 || count == 4)
        return;

    ((Func)f)(foo2);
}
    `,
    question: "מהו הפלט של התכנית הבאה?",
    answers: [
      "`foo1 foo1 foo2 foo1`",
      "`foo1 foo1 foo1 foo2`",
      "התכנית לא עוברת קומפילציה",
      "התכנית נכנסת ללולאה אינסופית",
      "יתר התשובות אינן נכונות",
    ],
    correct: 0,
    hint: "עקבו אחר שרשרת הקריאות בין הפונקציות `foo1` ו־`foo2`. שימו לב במיוחד כיצד המונה הגלובלי `count` ותנאי העצירה בכל פונקציה משפיעים על סיום הרקורסיה ההדדית.\nלגבי ה־typedef שבשורה הראשונה: הוא יוצר שם חדש לסוג של מצביע לפונקציה שמחזירה `void` ומקבלת פרמטר אחד מסוג `void*`. עכשיו, במקום לכתוב את הצורה המלאה של מצביע לפונקציה כל פעם, אפשר פשוט לכתוב `Func` (ואנחנו אכן משתמשים בקיצור הזה בשורה האחרונה של כל אחת מהפונקציות `foo`).",
    explanation:
      'הקריאה הראשונה מהפונקציה `main` היא `foo1(foo1)`. בתוך `foo1`, הפלט "foo1 " מודפס, המונה הגלובלי `count` גדל ל־1, ותנאי העצירה `f == foo1` מתקיים. לכן הפונקציה חוזרת מיד.\nהקריאה השנייה היא `foo1(foo2)`. הפלט "foo1 " מודפס ו־`count` הופך ל־2. תנאי העצירה אינו מתקיים, ולכן מתבצעת קריאה ל־`((Func)f)(foo1)`, שהיא למעשה `foo2(foo1)`. בתוך `foo2`, הפלט "foo2 " מודפס ו־`count` הופך ל־3. שוב, תנאי העצירה לא מתקיים והפעם מתבצעת קריאה ל־`foo1(foo2)`.\nבקריאה האחרונה ל־`foo1(foo2)`, הפלט "foo1 " מודפס ו־`count` הופך ל־4. כעת, תנאי העצירה `count == 4` מתקיים, והפונקציה חוזרת. שרשרת הקריאות מסתיימת, והפלט הסופי שהודפס הוא `foo1 foo1 foo2 foo1`.',
  },
  {
    code: `typedef struct Node {
    char *data;
    struct Node *next;
} Node;

typedef struct List {
    Node *head, *tail;
} List;

void DeleteList(List *list) {
    while (list->head)
        DeleteFirst(list);
        
    free(list);
}
    
void DeleteFirst(List *list) {
  Node *node_to_delete = list->head;
  list->head = list->head->next;
  FreeNode(node_to_delete);
  
  if (list->head == NULL)
      list->tail = NULL;
}

void FreeNode(Node *node_to_free){
    free(node_to_free->data);
    free(node_to_free);
}`,
    question: "איזו מבין הטענות הבאות היא הנכונה ביותר:",
    answers: [
      "הפונקציה `DeleteList` תעבוד בצורה תקינה רק אם המשתנה `list` מצביע למקום שהוקצה דינאמית",
      "הפונקציה `DeleteList` תמיד תניב שגיאת זמן ריצה בעת ביצוע ה־`free`",
      "הפונקציה `DeleteList` תקינה ותעבוד בכל המקרים",
      "יש להעביר את פקודת ה־`free` אל הפונקציה הקוראת מיד לאחר הקריאה ל־`DeleteList` כדי להימנע משגיאת זמן ריצה",
      "קטע הקוד לא יעבור קומפילציה",
      "אף תשובה מהתשובות האחרות אינה נכונה",
    ],
    correct: 0,
    hint: "שימו לב לפעולה האחרונה שמתבצעת בפונקציה `DeleteList`. על אילו סוגי משתנים מותר לקרוא לפקודה `free`, ומה יקרה אם נקרא לה על משתנה שלא הוקצה באופן המתאים?",
    explanation:
      "הבעייתיות בקוד טמונה בשורה האחרונה של הפונקציה `DeleteList`, והיא `free(list)`. פקודת `free` בשפת C מיועדת לשחרור זיכרון שהוקצה באופן דינאמי על 'הערימה' (heap), למשל באמצעות `malloc`. אם מתכנת יקרא לפונקציה `DeleteList` עם מצביע למבנה `List` שנוצר על 'המחסנית' (stack), הקריאה `free(list)` תגרום לקריסת התוכנית. לכן, תקינות הפונקציה תלויה לחלוטין בכך שהמשתנה `list` מצביע לזיכרון שהוקצה דינאמית.\n\nשאר התשובות אינן נכונות. הפונקציה לא תמיד תניב שגיאה, כיוון שהיא תעבוד נכון עבור רשימה שהוקצתה דינאמית. העברת פקודת ה־`free` החוצה היא שינוי עיצובי שמשנה את אחריות הפונקציה, אבל הוא לא מתקן איזה באג. הקוד תקין מבחינה תחבירית ויעבור קומפילציה ללא שגיאות.",
  },
  {
    code: `#define SWAP( SRC, DST, TMP, LEN) {\\
        memcpy(TMP, SRC, LEN);	 \\
        memcpy(SRC, DST, LEN);	 \\
        memcpy(DST, TMP, LEN);   \\
}

void swap(void *arr, int numElm, int sizeElm) {

    void *tmp, *an;
    int n = numElm - 1;

    tmp = malloc(sizeElm);

    for ( ; n > 0; n -= 2) {
        an = ( [[1]] );
        SWAP( [[2]] , an, tmp, sizeElm);
    }

    free(tmp);
}`,
    question:
      "בהינתן שהפונקציה `swap` נועדה להחליף בין זוגות של איברים סמוכים החל מסוף המערך, מה יש למלא בתיבות 1 ו־2?",
    answers: [
      "אף תשובה מהתשובות האחרות אינה נכונה",
      "[[1: (void *)((char*)arr +(n-1)*sizeElm)]][[2: an+1]]",
      "[[1: (void *)((char*)arr + n*sizeElm)]][[2: an-1]]",
      "[[1: (char *)((void*)arr + n*sizeElm)]][[2: (void *)((char*)arr + (n-1)*sizeElm)]]",
      "[[1: (void *)((char*)arr + n*sizeElm)]][[2: (void *)((char*)an - 1)]]",
      "שתי תשובות או יותר מהאחרות נכונות",
    ],
    correct: 0,
    hint: "`an` הוא מצביע מטיפוס `void` ולכן לא ניתן לעשות לו `+1` או `-1`, ולכן שתי תשובות כבר נפסלות.",
    explanation:
      "אף אחת מהתשובות המוצעות אינה נכונה. כדי שהקוד יפעל כמצופה, יש לבצע חישובי כתובות מדויקים על מצביעים גנריים (`void*`), דבר הדורש המרה למצביע לבית (`char*`).\n\nבתיבה 1, המטרה היא להציב במשתנה `an` את הכתובת של האיבר במקום ה־`n`. הדרך הנכונה לעשות זאת היא לקחת את כתובת הבסיס של המערך `arr`, לבצע לה המרה ל־`char*`, להוסיף לה את ההיסט (offset) בבתים, שגודלו `n * sizeElm`, ואז להמיר חזרה ל־`void*`. לכן, הביטוי הנכון הוא: `(void*)((char*)arr + n * sizeElm)`.\n\nבתיבה 2, המטרה היא לספק לפונקציה `swap` את הכתובת של האיבר במקום ה־`n-1`, כלומר האיבר הקודם לזה שכתובתו נמצאת ב־`an`. מכיוון שכבר יש לנו את הכתובת של האיבר ה־`n`, הדרך היעילה ביותר היא לקחת את המצביע `an`, להמיר אותו ל־`char*`, להחסיר ממנו את גודל האיבר (`sizeElm`) כדי לחזור לאיבר הקודם, ולהמיר חזרה ל־`void*`. לכן, הביטוי הנכון הוא: `(void*)((char*)an - sizeElm)`.\n\nאפשרות נוספת נכונה לתיבה 2 היא לחשב ישירות את כתובת האיבר במקום `n-1` מתוך `arr`: נבצע `char*` cast ל־`arr`, נוסיף `(n - 1) * sizeElm`, ואז נהפוך חזרה ל־`void*`. כלומר: `(void*)((char*)arr + (n - 1) * sizeElm)`.\n\nכפי שניתן לראות, אף אחת מהאפשרויות אינה מכילה את שני הביטויים הנכונים, ולכן התשובה היא שאף אחת מהתשובות האחרות לא נכונה.",
  },
  {
    code: `extern int x;

void main() {
    int x = 10;
    a();
    b();
    c();
    a();
    b();
    c();
    printf("%d ", x);
}

void a() {
    int x = 100;
    printf("%d ", x);
    x += 5;
}

void b() {
    static int x = -10;
    printf("%d ", x);
    x += 5;
}

void c() {
    printf("%d ", x);
    x += 2;
}

int x = 0;`,
    question: "מהו הפלט של תכנית זו?",
    answers: [
      "`100 -10 0 100 -5 2 10`",
      "התכנית לא מתקמפלת בגלל התנגשות בשמות משתנים",
      "התכנית לא מתקמפלת בגלל הגדרה שגויה או אתחול שגוי של משתנה גלובלי",
      "`100 -10 0 100 -5 2 2`",
      "כל התשובות אינן נכונות",
    ],
    correct: 0,
    hint: "אם נראה מוזר שהקוד מתקמפל למרות שהמשתנה הגלובלי `x` מוגדר בסוף הקובץ, שימו לב להצהרת ה־`extern` בתחילת הקוד. הצהרה זו מודיעה לקומפיילר על קיומו של המשתנה הגלובלי מראש.",
    explanation:
      "הקוד מדגים את כללי הנראות (scope) של משתנים ב־C. ראשית, הקוד עובר קומפילציה תקינה. הצהרת `extern int x;` בתחילת הקובץ מיידעת את הקומפיילר על קיומו של משתנה גלובלי בשם `x`, גם אם הגדרתו המלאה מופיעה בסוף הקובץ.\n\nהפונקציה `a` מגדירה משתנה מקומי חדש `x` בכל קריאה, ולכן תמיד תדפיס `100`. הפונקציה `b` מגדירה משתנה `static` מקומי `x`, המאותחל ל־`-10` רק בקריאה הראשונה. ערכו נשמר בין הקריאות, ולכן בקריאה השנייה הוא ידפיס `-5`. הפונקציה `c` ניגשת למשתנה הגלובלי `x`, שמתחיל בערך `0` וגדל ב־2 בכל קריאה. לכן היא תדפיס `0` ואז `2`.\n\nלבסוף, פקודת ההדפסה בפונקציה `main` מתייחסת למשתנה המקומי של `main`, שערכו `10` לאורך כל ריצת התכנית. שרשור ההדפסות לפי סדר הקריאות נותן את הפלט המלא.",
  },
  {
    code: `int num = 10;

int f1() {
  static int num;
  num = 1;
  num++;
  return num - 1;
}

int f2() {
  static int num = 1;
  num++;
  return num - 1;
}

int f3() {
  num++;
  return num - 1;
}

void main() {
  for (int num = 0; num < 3; num++)
    printf("%d %d %d # ", f1(), f2(), f3());
}`,
    question: "מהו הפלט של התכנית הבאה?",
    answers: [
      "`1 1 10 # 1 2 11 # 1 3 12 #`",
      "`1 1 10 # 1 2 10 # 1 3 10 #`",
      "`1 1 10 # 2 2 11 # 3 3 12 #`",
      "התכנית אינה מתקמפלת",
      "כל התשובות האחרות אינן נכונות",
    ],
    correct: 0,
    hint: "שימו לב להבדלים בין המשתנים השונים ששמם `num`. המשתנה בתוך `f1` מאותחל מחדש בכל קריאה, בעוד שהמשתנים ב־`f2` וב־`f3` שומרים על ערכם בין הקריאות.\n\nכמו כן, זכרו שהפעולה `num++` משנה את ערך המשתנה, בעוד שהביטוי `num - 1` שומר על ערכו של `num` ורק מחזיר את תוצאת החישוב.",
    explanation:
      "השאלה בוחנת את ההבנה של טווח הכרזה (scope) של משתנים, ובמיוחד את ההבדל בין משתנה סטטי מקומי המאופס בכל קריאה, משתנה סטטי מקומי השומר על ערכו, ומשתנה גלובלי.\n\nבפונקציה `f1`, המשתנה הסטטי `num` מאותחל לאפס, אך מיד לאחר מכן מקבל את הערך 1 בכל קריאה. לכן, הפונקציה תמיד תחזיר את הערך `1`.\n\nבפונקציה `f2`, המשתנה הסטטי `num` מאותחל ל־1 רק בקריאה הראשונה. ערכו נשמר וגדל ב־1 בכל קריאה, ולכן הפונקציה תחזיר `1`, `2`, ו־`3` בסדר זה.\n\nהפונקציה `f3` עובדת על המשתנה הגלובלי `num` שערכו ההתחלתי הוא 10. ערך זה גדל בכל קריאה, ולכן הפונקציה תחזיר `10`, `11`, ו־`12`. שילוב הפלטים בכל איטרציה של הלולאה מוביל לתשובה הנכונה.",
  },
  {
    code: `void main() {
    bar();
    bar();
}

void bar() {
    static int i, a = -3, b = -6; 
    
    i = 0;
    while (i <= 4) {
        if (i % 2 == 1) {
            i++;
            continue;
        }
        
        i += 1;

        a = a + i;
        b += i;
    }
    
    foo(&a, &b);
    printf("%d %d ", a, b);
}

void foo(int *a, int *b) {
    static int *t;
    t = a;
    a = b;
    b = t;
}`,
    question: "מהו הפלט של תכנית זו?",
    answers: [
      "כל התשובות האחרות אינן נכונות",
      "`0 3 0 3`",
      "`3 6 12 15`",
      "`0 -3 3 0`",
      "`6 3 15 12`",
    ],
    correct: 4,
    hint: "האם הפונקציה `foo` באמת משנה את מה שקורה ב־`bar`? שימו לב מה בדיוק `foo` מקבלת. האם היא עובדת על המצביעים המקוריים או על משהו אחר? בנוסף, נסו להיזכר מה המשמעות של משתנה שהוגדר כ־`static` בתוך פונקציה — איך זה משפיע על ההתנהגות שלו בקריאות חוזרות?",
    explanation:
      "המשתנים `a` ו־`b` בתוך הפונקציה `bar` מוגדרים כ־`static`, כלומר הם מאותחלים רק בפעם הראשונה שהפונקציה נקראת, ושומרים על ערכם בין קריאות שונות. בתחילת הקריאה הראשונה ל־`bar`, הם מאותחלים ל־3- ו־6-.\n\nבמהלך כל קריאה לפונקציה `bar`, לולאת ה־`while` מריצה סדרה קבועה של פעולות שמוסיפות יחדיו 9 לכל אחד מהמשתנים — כלומר, כל קריאה ל־`bar` מגדילה את `a` ו־`b` בדיוק ב־9.\n\nהקריאה הראשונה ל־`bar` הופכת את `a` ל־6 ואת `b` ל־3. לאחר מכן נקראת הפונקציה `foo`. שימו לב: `foo` מקבלת את המצביעים כפרמטרים, אבל היא מבצעת את ההחלפה רק בין ההעתקים המקומיים של המצביעים — היא לא משנה את תוכן המשתנים עצמם. כלומר, לקריאה ל־`foo` אין שום השפעה על ערכי `a` ו־`b`.\n\nבקריאה השנייה ל־`bar`, המשתנים מתחילים מהערכים הקודמים — `a` שווה ל־6 ו־`b` שווה ל־3, ומקבלים תוספת של 9 נוספים מהלולאה, כך שהם הופכים ל־15 ו־12 בהתאמה.\n\nלכן הפלט המלא של התוכנית הוא:`6 3 15 12`.",
  },
  {
    code: `void *FindMin(void *arr, unsigned int numElems, 
              unsigned int elemSize,
              int (*cmp)(void *, void *)) {

    void *min = arr, *elem;

    for (unsigned int i = 1; i < numElems; i++) {
        elem = (char *)arr + i * elemSize;
        if (cmp(elem, min) < 0)
            min = elem;
    }
    return min;
}

int cmp(void *a, void *b) { 
    return([[1]]); 
}

void main() {
    // נתון המערך שבשאלה
    int **arr;
    // ... המערך הוקצה, הנתונים הוכנסו ...

    void *min = FindMin(arr, size, sizeof(int*), cmp);
    printf("min: %d", [[2]]);
}
`,
    question:
      "בהינתן הפונקציה הגנרית `FindMin` ומערך `arr` של מצביעים ל־`int`,איזה ערכים צריך להכניס לתיבות 1 עד 3 כדי שפונקציית ההשוואה `cmp` תמצא את הערך המינימלי במערך?",
    answers: [
      "[[1: **(int**)a - **(int**)b]][[2: **(int**)min]]",
      "[[1: *(int*)a - *(int*)b]][[2: *(int*)min]]",
      "[[1: **(int**)a - *(int**)b]][[2: **(int**)min]]",
      "[[1: *(int**)a - *(int**)b]][[2: *(int**)min]]",
      "אף אחד מהתשובות לא נכונה",
      "יותר מתשובה אחת נכונה",
    ],
    correct: 0,
    hint: "הפונקציה הגנרית `FindMin` מעבירה לפונקציית ההשוואה מצביעים לאיברים במערך. חשבו מהו הטיפוס של איבר בודד במערך `arr`, ובהתאם, מהו הטיפוס של מצביע לאיבר כזה. כמה פעולות `dereference` (`*`) נדרשות כדי להגיע מהמצביע שמתקבל בפונקציה אל ערך ה-`int` הסופי?",
    explanation:
      "בתיבה 1, הפרמטרים `a` ו־`b` מוצהרים כ־`void*`. אי אפשר לבצע פעולת `dereference` (`*`) ישירות על מצביע `void*`, ולכן חובה לבצע לו המרה (cast) לטיפוס הנכון. מכיוון שהם מצביעים לאיברים במערך `int**`, הטיפוס האמיתי שלהם הוא `int**`.\n\nכיוון שמדובר על פוינטר לפוינטר למספר, כדי לגשת לערך המספר עצמו, נצטרך לבצע `dereference` כפול (`**`). לכן, התשובה היא `**(int**)a - **(int**)b`.\n\nבתיבה 2, הפונקציה `FindMin` מחזירה `void*` המצביע לאיבר המינימלי במערך. כדי להדפיס את ערך המספר הסופי, יש לבצע תהליך זהה: המרה של המצביע `min` ל־`int**` ולאחר מכן `dereference` כפול. לכן, הביטוי הנכון להדפסה הוא `**(int**)min`.",
  },
  {
    code: `void genBubble(void *v, unsigned int numOfElements, 
                unsigned int elementSize, 
                int (*compare)(void *, void *)) {

    void *v_j, *v_j1;

    for (int i = numOfElements - 1; i > 0; i--) {
        for (int j = 0; j < i; j++) {

            v_j = (void *)((char *)v + j*elementSize);
            v_j1 = (void *)((char *)v_j + elementSize);

            if ((*compare)( v_j, v_j1) > 0) {
                /* swap מימוש אלגוריתם */
            }
        }
    }
}

int cmp(Student [[1]] s1, Student [[2]] s2) {
    return (strcmp( [[3]] , [[4]] ));
}`,
    question:
      "בהינתן הפונקציה `genBubble` ומערך `arr` של מצביעים לסטודנטים, איזו מהאפשרויות להשלמת התיבות בפונקציה `cmp` תאפשר למיין את המערך לפי שמות הסטודנטים באמצעות קריאה ל־`genBubble`?",
    answers: [
      "אף אחת מהתשובות לא נכונה",
      "[[1: **]][[2: **]][[3: (*s1)->name]][[4: (*s2)->name]]",
      "[[1: *]][[2: *]][[3: s1->name]][[4: s2->name]]",
      "[[1: **]][[2: **]][[3: s2->name]][[4: (*s1)->name]]",
      "[[1: **]][[2: *]][[3: (*s2)->name]][[4: s1->name]]",
      "יותר מתשובה אחת נכונה",
    ],
    correct: 0,
    hint: "שימו לב לחתימה של פונקציית ההשוואה שהפונקציה הגנרית `genBubble` מצפה לקבל כפרמטר. איזה תשובה תגרום לפונקציה `cmp` להיות תואמת לדרישה זו?",
    explanation:
      "הבעיה כאן היא עקרונית ועוסקת בתאימות טיפוסים של מצביעים לפונקציות. הפונקציה `genBubble` דורשת לקבל פונקציית השוואה מהצורה `int (*compare)(void *, void *)`, כלומר פונקציה שמקבלת שני פרמטרים מסוג `void*`.\n\nלעומת זאת, כל האפשרויות המוצעות מנסות לממש את `cmp` עם חתימה ספציפית יותר, כמו `int cmp(Student** s1, Student** s2)`. מכיוון שהחתימות אינן זהות, הקומפיילר יפיק שגיאה על אי־התאמה בטיפוסים בעת הניסיון להעביר את `cmp` כארגומנט ל־`genBubble`.\n\nלכן, אף אחת מהאפשרויות לא תאפשר לקוד לעבור קומפילציה כפי שהוא, והתשובה הנכונה היא שאף אחת מהתשובות האחרות לא נכונה.",
  },
];
