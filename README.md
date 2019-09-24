<div align="center">

# mongoose-dependent-seed :seedling: 
![BuildStatus](https://travis-ci.org/SharonGrossman/mongoose-dependent-seed.svg?branch=master) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

</div>

## Install
```
npm install mongoose-dependent-seed
yarn add mongoose-dependent-seed
```

## Description
Mongoose database seeder - using your model dependency graph

## Usage

`seed.js`
```
import Dependency from './dependency.model.js';

export default {
    dependencies: [Dependency],
    seed: deps => [
        {
            dependency,
            ...rest
        }
    ]
}
```

`model.js`
```
import createSeed from 'mongoose-dependent-seed';
import seed from './seed.js';

const Schema = new Schema({...});

export default createSeed('Model', Schema, seed);
```

`app.js`
```
import { seed } from 'mongoose-dependent-seed';

try {
    await seed();
    { ... }
} catch(error) { ... }
```
## License

[MIT](LICENSE) © [Sharon Grossman](https://github.com/sharongrossman)