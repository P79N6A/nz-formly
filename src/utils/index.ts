
import { Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';


export const FORMLY_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];

export function assignModelValue(model: any, paths: string[], value: any) {
  for (let i = 0; i < (paths.length - 1); i++) {
    const path = paths[i];
    if (!model[path] || !isObject(model[path])) {
      model[path] = /^\d+$/.test(path) ? [] : {};
    }

    model = model[path];
  }

  model[paths[paths.length - 1]] = value;
}


export function reverseDeepMerge(dest: any, ...args: any[]) {
  args.forEach(src => {
    for (let srcArg in src) {
      if (isNullOrUndefined(dest[srcArg]) || isBlankString(dest[srcArg])) {
        if (isFunction(src[srcArg])) {
          dest[srcArg] = src[srcArg];
        } else {
          dest[srcArg] = clone(src[srcArg]);
        }
      } else if (objAndSameType(dest[srcArg], src[srcArg])) {
        reverseDeepMerge(dest[srcArg], src[srcArg]);
      }
    }
  });
  return dest;
}

export function isNullOrUndefined(value: any) {
  return value === undefined || value === null;
}

export function isUndefined(value: any) {
  return value === undefined;
}

export function isBlankString(value: any) {
  return value === '';
}

export function isFunction(value: any) {
  return typeof(value) === 'function';
}

export function objAndSameType(obj1: any, obj2: any) {
  return isObject(obj1) && isObject(obj2)
    && Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2)
    && !(Array.isArray(obj1) || Array.isArray(obj2));
}

export function isObject(x: any) {
  return x != null && typeof x === 'object';
}

export function clone(value: any): any {
  if (!isObject(value) || value instanceof RegExp || value instanceof Observable || /* instanceof SafeHtmlImpl */ value.changingThisBreaksApplicationSecurity) {
    return value;
  }

  if (value instanceof AbstractControl) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.slice(0).map(v => clone(v));
  }

  value = Object.assign({}, value);
  Object.keys(value).forEach(k => value[k] = clone(value[k]));

  return value;
}

export function defineHiddenProp(field, prop, defaultValue) {
  Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
  field[prop] = defaultValue;
}

export function wrapProperty<T = any>(field, prop, setFn: (newVal: T, oldVal?: T) => void) {
  let value = field[prop];
  setFn(value);

  Object.defineProperty(field, prop, {
    configurable: true,
    get: () => value,
    set: newVal => {
      if (newVal !== value) {
        setFn(newVal, value);
        value = newVal;
      }
    },
  });
}