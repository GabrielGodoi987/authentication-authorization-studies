import {
  Specification,
  WhereSpecification,
  AndSpecification,
  OrSpecification,
  NotSpecification,
} from "../../../../src/lib/specifications-base/base.specifications";

class AlwaysTrueSpec extends Specification<string> {
  isSatisfiedBy(): boolean {
    return true;
  }
}

class AlwaysFalseSpec extends Specification<string> {
  isSatisfiedBy(): boolean {
    return false;
  }
}

class LengthGreaterThan3 extends Specification<string> {
  isSatisfiedBy(candidate: string): boolean {
    return candidate.length > 3;
  }
}

class StartsWithA extends Specification<string> {
  isSatisfiedBy(candidate: string): boolean {
    return candidate.startsWith("A");
  }
}

describe("WhereSpecification", () => {
  it("should be satisfied when all where conditions match", () => {
    const spec = new WhereSpecification({ name: "John", age: 30 });

    expect(spec.isSatisfiedBy({ name: "John", age: 30 })).toBe(true);
  });

  it("should not be satisfied when a condition does not match", () => {
    const spec = new WhereSpecification({ name: "John", age: 30 });

    expect(spec.isSatisfiedBy({ name: "John", age: 25 })).toBe(false);
  });

  it("should return the where clause on toWhere", () => {
    const where = { name: "John" };
    const spec = new WhereSpecification(where);

    expect(spec.toWhere()).toBe(where);
  });
});

describe("Specification", () => {
  it("should throw on toWhere when not a WhereSpecification", () => {
    const spec = new AlwaysTrueSpec();

    expect(() => spec.toWhere()).toThrow(
      "Only WhereSpecification can be converted to where clause",
    );
  });
});

describe("AndSpecification", () => {
  it("should be satisfied when both specs are satisfied", () => {
    const spec = new AndSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("Apple")).toBe(true);
  });

  it("should not be satisfied when left fails", () => {
    const spec = new AndSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("An")).toBe(false);
  });

  it("should not be satisfied when right fails", () => {
    const spec = new AndSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("Pear")).toBe(false);
  });

  it("should not be satisfied when both fail", () => {
    const spec = new AndSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("No")).toBe(false);
  });
});

describe("OrSpecification", () => {
  it("should be satisfied when both are satisfied", () => {
    const spec = new OrSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("Apple")).toBe(true);
  });

  it("should be satisfied when only left is satisfied", () => {
    const spec = new OrSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("Pear")).toBe(true);
  });

  it("should be satisfied when only right is satisfied", () => {
    const spec = new OrSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("An")).toBe(true);
  });

  it("should not be satisfied when both fail", () => {
    const spec = new OrSpecification(
      new LengthGreaterThan3(),
      new StartsWithA(),
    );

    expect(spec.isSatisfiedBy("No")).toBe(false);
  });
});

describe("NotSpecification", () => {
  it("should negate a true spec", () => {
    const spec = new NotSpecification(new AlwaysTrueSpec());

    expect(spec.isSatisfiedBy("anything")).toBe(false);
  });

  it("should negate a false spec", () => {
    const spec = new NotSpecification(new AlwaysFalseSpec());

    expect(spec.isSatisfiedBy("anything")).toBe(true);
  });
});

describe("Specification combinators (and / or / not)", () => {
  it("should combine with and()", () => {
    const spec = new LengthGreaterThan3()
      .and(new StartsWithA());

    expect(spec.isSatisfiedBy("Apple")).toBe(true);
    expect(spec.isSatisfiedBy("Pear")).toBe(false);
  });

  it("should combine with or()", () => {
    const spec = new LengthGreaterThan3()
      .or(new StartsWithA());

    expect(spec.isSatisfiedBy("Pear")).toBe(true);
    expect(spec.isSatisfiedBy("No")).toBe(false);
  });

  it("should combine with not()", () => {
    const spec = new LengthGreaterThan3().not();

    expect(spec.isSatisfiedBy("Hi")).toBe(true);
    expect(spec.isSatisfiedBy("Hello")).toBe(false);
  });

  it("should chain multiple combinators", () => {
    const spec = new LengthGreaterThan3()
      .and(new StartsWithA())
      .or(new LengthGreaterThan3().and(new StartsWithA()).not());

    expect(spec.isSatisfiedBy("Apple")).toBe(true);
    expect(spec.isSatisfiedBy("No")).toBe(true);
  });
});
