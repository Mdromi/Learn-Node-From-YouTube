
// dependencies

// module scaffolding
const environments = {}

environments.staging = {
    port: 4000,
    envName: 'staging',
    secretKey: 'ashsdoaisd903749isuoj',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: ''
    }
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'e8eueioiu903749isuoj',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: ''
    }
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;