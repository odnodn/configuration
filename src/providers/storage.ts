
/* IMPORT */

import pp from 'path-prop';
import {Data, DataRaw, DataUpdate, ProviderStorageOptions} from '../types';
import {DEFAULTS} from '../config';
import ProviderMemory from './memory';

/* STORAGE */

class ProviderStorage<Options extends ProviderStorageOptions = ProviderStorageOptions> extends ProviderMemory<Options> {

  id: string;
  storage?: Storage;

  constructor ( options: Partial<Options> ) {

    super ( options );

    if ( !options.storage ) throw new Error ( 'You need to pass a storage instance' );

    this.id = options?.id ?? DEFAULTS.id;
    this.storage = options.storage;

    this.init ();

  }

  readSync (): DataUpdate {

    if ( !this.storage ) return super.readSync ();

    const dataRaw = this.storage.getItem ( this.id ) ?? this.defaultsRaw,
          data = pp.unflat ( this.dataParser.parse ( dataRaw ) ?? this.defaults );

    return {data, dataRaw};

  }

  writeSync ( data: Data | DataRaw, force: boolean = false ): void {

    if ( !this.storage ) return super.writeSync ( data, force );

    if ( !force && this.isEqual ( data ) ) return;

    super.writeSync ( data, true );

    try {

      this.storage.setItem ( this.id, this.dataRaw );

    } catch {}

  }

}

/* EXPORT */

export default ProviderStorage;
