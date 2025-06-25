// quizzes/other.js
const quizData = [
  {
    code: "", // This question has no code
    question:
      "איזו מילת מפתח משמשת ב-C כדי להודיע לקומפיילר שערכו של משתנה עשוי להשתנות באופן בלתי צפוי על ידי גורם חיצוני (כמו חומרה או תהליך אחר), ולכן יש להימנע מאופטימיזציות מסוימות עליו?איזו מילת מפתח משמשת ב-C כדי להודיע לקומפיילר שערכו של משתנה עשוי להשתנות באופן בלתי צפוי על ידי גורם חיצוני (כמו חומרה או תהליך אחר), ולכן יש להימנע מאופטימיזציות מסוימות עליו?איזו מילת מפתח משמשת ב-C כדי להודיע לקומפיילר שערכו של משתנה עשוי להשתנות באופן בלתי צפוי על ידי גורם חיצוני (כמו חומרה או תהליך אחר), ולכן יש להימנע מאופטימיזציות מסוימות עליו?איזו מילת מפתח משמשת ב-C כדי להודיע לקומפיילר שערכו של משתנה עשוי להשתנות באופן בלתי צפוי על ידי גורם חיצוני (כמו חומרה או תהליך אחר), ולכן יש להימנע מאופטימיזציות מסוימות עליו?",
    answers: ["static", "extern", "volatile", "register", "const"],
    correct: 2,
    hint: "מילת המפתח הזו מבטיחה שכל גישה למשתנה תהיה קריאה ישירה מהזיכרון, ולא מערך שמור ברגיסטר.",
    explanation:
      "המילה `volatile` משמשת בדיוק למטרה זו. היא מורה לקומפיילר לא לבצע אופטימיזציות שעלולות להניח שערך המשתנה קבוע אם הקוד עצמו אינו משנה אותו. זה קריטי במערכות משובצות חומרה (embedded) ובתכנות מקבילי.",
  },
  {
    code: `#include <stdio.h>
#define SIZE 5

int queue[SIZE];
int front = -1, rear = -1;

int isFull() {
    return (front == (rear + 1) % SIZE);
}

int isEmpty() {
    return (front == -1);
}

void enqueue(int value) {
    if (isFull()) {
        printf("Queue is full\\n");
        return;
    }
    if (isEmpty()) {
        front = rear = 0;
    } else {
        rear = (rear + 1) % SIZE;
    }
    queue[rear] = value;
}

int dequeue() {
    if (isEmpty()) {
        printf("Queue is empty\\n");
        return -1;
    }
    int data = queue[front];
    if (front == rear) {
        front = rear = -1;
    } else {
        front = (front + 1) % SIZE;
    }
    return data;
}

void display() {
    if (isEmpty()) {
        printf("Queue is empty\\n");
        return;
    }
    printf("Queue: ");
    int i = front;
    while (1) {
        printf("%d ", queue[i]);
        if (i == rear) break;
        i = (i + 1) % SIZE;
    }
    printf("\\n");
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    enqueue(40);
    enqueue(50); // This should fill the queue
    display();
    dequeue();
    dequeue();
    display();
    enqueue(60);
    enqueue(70); // This should wrap around
    display();
    return 0;
}`,
    question: "מה יודפס למסך לאחר הריצה של הקוד המלא שלמעלה?",
    answers: [
      "Queue: 10 20 30 40 50\nQueue: 30 40 50\nQueue: 30 40 50 60 70",
      "Queue: 10 20 30 40 50\nQueue: 10 20 30\nQueue: 10 20 30 60 70",
      "Queue: 10 20 30 40 50\nQueue: 30 40 50\nQueue: 60 70 30 40 50",
      "Queue: 10 20 30 40 50\nQueue: 30 40 50\nQueue: 60 70",
      "Queue is full\nQueue is full\nQueue: 10 20 30 40 50",
    ],
    correct: 0,
    hint: "שימי לב לאיך rear ו־front מתנהגים כשיש גלישה מעגלית.",
    explanation:
      "בהתחלה, התור מתמלא ל־10 20 30 40 50. לאחר שתי קריאות dequeue, נשארים 30 40 50. ההוספות הבאות הן 60 ו־70, שנכנסות בתחילת המערך (מעגלית). לכן התור הסופי הוא 30 40 50 60 70.",
  },
];
