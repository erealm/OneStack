import { EventEmitter } from 'events'
import { Directory } from './utils/directory'
import { agent, success, prerequisite } from 'agentframework'
import { Loader } from './utils/loader'
import { IsUndefined } from './utils/utils'
import { IKernelOptions, KernelOptions } from './kernelOptions'
import { Logger } from './utils/logger'
import { ILogger } from './log';
import { Printer } from './utils/printer';
import { IKernelSettings } from './kernelSettings';
export { IKernelSettings } from './kernelSettings';

/**
 * naming an agent using @gent
 */
@agent('OneStack')
export class Kernel<T extends IKernelSettings> extends EventEmitter {

  protected _id: number;
  private _root: Directory;
  private _settings: T;
  private _logger: ILogger;
  private _opts: IKernelOptions;

  constructor() {
    super();
    this._id = Date.now();
  }

  @prerequisite('initialized', false, 'OneStack already initialized')
  @success('initialized', true)
  public init(opts?: IKernelOptions): void {
    this._opts = KernelOptions.parse(opts);
    this._root = Directory.withReadPermission(this._opts.root);
    this._settings = Loader.loadSettings<T>(this._root, this._opts.confDir);
    this._logger = Logger.createFromSettings(this._settings);
    Printer.printSettings<T>(this._settings, this._logger);
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get root(): Directory {
    return this._root;
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public resolve(relativePath = ''): Directory {
    return this._root.resolve(relativePath);
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get settings(): T {
    return this._settings;
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get(key: string): boolean {
    if (IsUndefined(this._settings[key])) {
      throw new Error('Missing required configuration setting: `' + key + '`');
    }
    return this._settings[key];
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public has(key: string): boolean {
    return !IsUndefined(this._settings[key]);
  }

  @prerequisite('initialized', true, 'OneStack not initialized. Please call init() first!')
  public get logger(): ILogger {
    return this._logger;
  }

}
