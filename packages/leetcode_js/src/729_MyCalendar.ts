// paste question code here
type S = { start: number; end: number };

class MyCalendar {
  private booked: S[] = [];

  constructor() {}

  book(start: number, end: number): boolean {
    let x = 0;
    let y = this.booked.length - 1;
    while (x <= y) {
      const mid = Math.floor((x + y) / 2);
      const cur = this.booked[mid];
      if (start >= cur.end) {
        x = mid + 1;
      } else if (end <= cur.start) {
        y = mid - 1;
      } else {
        return false;
      }
    }
    this.booked.splice(x, 0, { start, end });
    return true;
  }
}

class MyCalendar_1 {
  private booked: S[] = [];

  constructor() {}

  book(start: number, end: number): boolean {
    const s: S = { start, end };
    const available = !this.isBooked(s);
    if (available) {
      this.booked.push(s);
    }
    return available;
  }

  private isBooked(s: S) {
    return this.booked.some((s2) => this.interaction(s, s2));
  }

  private interaction(s1: S, s2: S): boolean {
    return (
      // s     e
      // |  s  |  e

      // s       e
      // |  s  e |
      (s1.start >= s2.start && s1.start < s2.end) ||
      //   s     e
      // s |  e  |

      //   s       e
      //   |  s  e |
      (s1.end > s2.start && s1.end <= s2.end) ||
      //   s  e
      // s |  | e
      (s1.start < s2.start && s1.end > s2.end)
    );
  }
}

/**
 * Your MyCalendar object will be instantiated and called as such:
 * var obj = new MyCalendar()
 * var param_1 = obj.book(start,end)
 */

// generate by ../generate.js
export { MyCalendar };
