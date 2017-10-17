class Fraction {
  constructor(num, denom) {
    this.num = num;
    this.denom = denom;

    this._reduce();
  }

  _reduce() {
    if (this.num === 0) {
      this.denom = 1;
      return;
    }

    let num = Math.abs(this.num);
    let denom = Math.abs(this.denom);
    const sign = this.num / num * this.denom / denom;

    while (num % 1 || denom % 1) {
      num *= 10;
      denom *= 10;
    }

    let r;
    let m = Math.max(num, denom);
    let n = Math.min(num, denom);

    while (r = m % n) {
      m = n;
      n = r;
    }

    this.num = sign * num / n;
    this.denom = denom / n;
  }

  ['+'](other) {
    const num = this.num * other.denom + other.num * this.denom;
    const denom = this.denom * other.denom;
    return new Fraction(num, denom);
  }

  ['-'](other) {
    const num = this.num * other.denom - other.num * this.denom;
    const denom = this.denom * other.denom;
    return new Fraction(num, denom);
  }

  ['*'](other) {
    const num = this.num * other.num;
    const denom = this.denom * other.denom;
    return new Fraction(num, denom);
  }

  ['/'](other) {
    const num = this.num * other.denom;
    const denom = this.denom * other.num;
    return new Fraction(num, denom);
  }

}

const hoge = new Fraction(1, 2);
const fuga = new Fraction(1, 3);
console.log(hoge + fuga);
console.log(hoge / fuga);
console.log((hoge + fuga) * (hoge / fuga));

