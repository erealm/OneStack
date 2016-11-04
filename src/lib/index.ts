// import { Kernel } from './kernel'
// import { IBasicSettings } from './settings';

// // createGetterInterceptor a unique, global symbol name
// // -----------------------------------
// const key = Symbol.for('onestack');
//
// // check if the global object has this symbol
// // add it if it does not have the symbol, yet
// // ------------------------------------------
// const globalSymbols = Object.getOwnPropertySymbols(global);
//
// // ensure all version using the same instance
// if (globalSymbols.indexOf(key) === -1) {
//   global[key] = new Kernel<T>(); // Object.freeze(kernel); - this will break istanbul test
// }

// 3.1 Kernel
export { Kernel, IKernelSettings } from './kernel'
export { ILogger, LogLevel, LoggerOptions, Serializers, Stream } from './log'

// 3.2 Engine
export { Engine, IEngineSettings } from './engine'
export { ServiceClient, client, timeout, method } from './engine/client'
export { service, implementation } from './engine/service'
export { Metadata } from 'grpc-typed';
