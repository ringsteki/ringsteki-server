module.exports = {
    apps : [{
        name: 'web-server',
        script: 'npm',
        args: 'run server',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
        },
        env_production: {
        }
    },
    {
        name: 'gamenode',
        script: 'npm',
        args: 'run gamenode',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
        },
        env_production: {
        }
    }]
};
