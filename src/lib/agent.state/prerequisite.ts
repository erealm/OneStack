import { IAttribute, IInterceptor, IInvocation, decorateClassMembers } from '../agent/core';
import { IsEqual, IsString } from '../agent/core/utils';

/**
 * Define a prerequisite
 * @param key
 * @param value
 * @param message
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
export function prerequisite(key: string, value: any, message: string|Error) {
  return decorateClassMembers(new PrerequisiteAttribute(key, value, message));
}

/**
 * PrerequisiteAttribute
 */
class PrerequisiteAttribute implements IAttribute, IInterceptor {
  
  static type: string = 'agent.framework.prerequisite';
  
  constructor(private _key: string, private _value: any, private _message: string|Error) {
  }
  
  get key(): string {
    return this._key
  }
  
  get value(): boolean {
    return this._value
  }
  
  get message(): string | Error {
    return this._message
  }
  
  beforeDecorate(target: Object|Function, targetKey?: string|symbol, descriptor?: PropertyDescriptor): boolean {
    return true;
  }
  
  getType(): string {
    return PrerequisiteAttribute.type
  }
  
  getInterceptor(): IInterceptor {
    return this;
  }
  
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {
  
    const actualValue = Reflect.get(invocation.target, this.key);
    
    // console.log(`actual: ${actualValue}  expect: ${this.value}`);
    if (!IsEqual(actualValue, this.value)) {
      if (IsString(this.message)) {
        throw new TypeError(this.message as string)
      }
      else {
        throw this.message;
      }
    }
    return invocation.invoke(parameters);
    
  }
  
}
