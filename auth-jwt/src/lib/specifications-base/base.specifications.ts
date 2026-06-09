export abstract class Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  toWhere() {
    if (this instanceof WhereSpecification) {
      return this.where;
    }
    throw new Error("Only WhereSpecification can be converted to where clause");
  }

  and(other: Specification<T>) {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>) {
    return new OrSpecification(this, other);
  }

  not() {
    return new NotSpecification(this);
  }
}

export class WhereSpecification<
  T extends Record<string, any>,
> extends Specification<T> {
  constructor(public where: Partial<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return Object.entries(this.where).every(
      ([key, value]) => candidate[key] === value,
    );
  }
}

export class AndSpecification<T> extends Specification<T> {
  constructor(
    public left: Specification<T>,
    public right: Specification<T>,
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return (
      this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
    );
  }
}

export class OrSpecification<T> extends Specification<T> {
  constructor(
    public left: Specification<T>,
    public right: Specification<T>,
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return (
      this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate)
    );
  }
}

export class NotSpecification<T> extends Specification<T> {
  constructor(public spec: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}
