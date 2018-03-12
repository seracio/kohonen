// @flow
const { NODE_ENV } = process.env;

const presetsTest = [
    '@babel/preset-flow',
    [
        '@babel/preset-env',
        {
            targets: {
                node: 'current'
            }
        }
    ]
];

const presetsProduction = [
    '@babel/preset-flow',
    [
        '@babel/preset-env',
        {
            targets: {
                browsers: ['last 2 versions', 'safari >= 7']
            },
            modules: false,
            forceAllTransforms: true
        }
    ]
];

module.exports = {
    plugins: ['@babel/plugin-proposal-object-rest-spread'],
    presets: NODE_ENV === 'test' ? presetsTest : presetsProduction
};
