import {
  decorateClassMethod, decorateClass,
  IAttribute, IInterceptor, IInvocation, AgentAttribute
} from 'agentframework';
import * as grpc from 'grpc-typed';
import { Readable } from 'stream';

/**
 * an methodstorage.service.ts
 */
export function service(identifier: string) {
  return decorateClass(new AgentAttribute(identifier));
}

/**
 * an method
 */
export function implementation() {
  return decorateClassMethod(new ServiceAttribute());
}

/**
 * Interceptor for service calls
 */
export class ServiceAttribute implements IAttribute, IInterceptor {
  
  getInterceptor(): IInterceptor {
    return this;
  }
  
  intercept(invocation: IInvocation, parameters: ArrayLike<any>): any {
    
    // make parameters more friendly
    const call = parameters[0];
    const expandedParameters = [];
    
    if (call.request) {
      Object.getOwnPropertyNames(call.request).forEach(name => expandedParameters.push(call.request[name]));
    }
    else {
      expandedParameters.push(call);
    }
    expandedParameters.push(call.metadata);
    
    const response = invocation.invoke(expandedParameters);
    
    if (parameters.length === 1) {
      if (response instanceof Readable) {
        const responseStream = response as Readable;
        responseStream.pipe(call);
      }
      else {
        const md = new grpc.Metadata();
        md.add('error', JSON.stringify(new TypeError('Implementation must return a Stream')));
        call.sendMetadata(md);
        call.end();
      }
    }
    else if (parameters.length === 2) {
      const sendUnaryData = parameters[1];
      if (response instanceof Promise) {
        response.then(result => {
          sendUnaryData(null, result);
        }).catch(err => {
          console.log('sending error to client', err);
          // hacking inner logic to send error if previous sendUnaryData got error;
          call.call.metadataSent = false;
          sendUnaryData(err);
        })
      }
      else {
        sendUnaryData(new TypeError('Implementation must return a Promise'));
      }
    }
    
    // not used by grpc, for unit test code which run locally.
    return response;
  }
}
