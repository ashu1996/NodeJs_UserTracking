module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'UserTracking',
      script : "./bin/www",
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      },
      watch     : true,
      exec_mode : "cluster",
      instances  : 0,
     ignore_watch: ["./public/images", "node_modules"],
     port : 3000,
     sitename : 'dev02.novuse.com',
     pm_exec_path : "/usr/bin/npm",
     exec_interpreter : "node",
     args : ["start","server.js"],
     node_args : []
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : '172.31.22.229',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:goyalzz/NodeJs_With_Angular_Js_Basic_Setup.git',
      path : '/opt/NodeJs_With_Angular_Js_Basic_Setup',
      'post-deploy' : 'npm update && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'root',
      host : '172.31.22.229',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:goyalzz/NodeJs_With_Angular_Js_Basic_Setup.git',
      path : '/opt/NodeJs_With_Angular_Js_Basic_Setup',
      'post-deploy' : 'npm update && pm2 reload ecosystem.config.js --env dev',
      env : {
        NODE_ENV: 'dev'
      }
    }
  }
};
