import {
  type Field,
  type Form,
  onFieldChange,
  onFieldInit,
  onFieldInputValueChange,
  onFieldMount,
  onFieldValueChange,
  isField,
} from '@formily/core';

const effectMap = {
  onFieldInit,
  onFieldMount,
  onFieldChange,
  onFieldValueChange,
  onFieldInputValueChange,
};

type SupportEffects = keyof typeof effectMap;

type EffectOption = {
  type: SupportEffects;
  target: string;
  deps: Record<string, string>;
  callback: (
    target: Field,
    deps: Record<string, Field>,
    form: Form,
  ) => void | Promise<void>;
};

class EffectIdGenerator {
  private _id = 0;

  next(): string {
    const id = `__private_${this._id}`;
    this._id += 1;
    return id;
  }
}

export const addFormEffect = (function () {
  const generator = new EffectIdGenerator();

  return function addFormEffect(
    form: Form,
    { type, target, deps, callback }: EffectOption,
  ) {
    form.addEffects(generator.next(), () => {
      const effectFunc = effectMap[type];
      effectFunc(target, (targetField, _form) => {
        const depFields: Record<string, Field> = {};
        for (const key in deps) {
          const depField = _form
            .query(deps[key])
            .take((field) => (isField(field) ? field : undefined));

          if (!depField) {
            console.error(`depField not found, pattern=${deps[key]}`);
          }
          depFields[key] = depField as Field;
        }

        if (!isField(targetField)) {
          console.error('targetField is not Field', targetField);
        }
        callback(targetField as Field, depFields, _form);
      });
    });
  };
})();
