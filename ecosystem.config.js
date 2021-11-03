module.exports = {
  apps: [{
    name: "apiResto",
    script: "./src/index.js",
    watch: true,
    env_local: {
      "NODE_ENV": "local",
      "API_DESCRIPTION": "Estás ejecutando tu API en modo desarrollador.",
      "MYSQL_DATABASE": "myapp2",
      "MYSQL_HOST": "database-1.crcr91wah2lj.sa-east-1.rds.amazonaws.com",
      "MYSQL_PORT": 3306,
      "MYSQL_USER": "adminroot",
      "MYSQL_PASS": "mimamamemima123",
      "EXPRESS_PORT": 5050,
      "JWT_PASS": "mimamamemimamimama",
      "CRYPTO_KEY": "superkey",
      "REDIS_HOST": "miprimerredis.qezaxv.0001.sae1.cache.amazonaws.com",
      "REDIS_PORT": 6379
    },
    env_production: {
      "NODE_ENV": "production",
      "API_DESCRIPTION": "Estás ejecutando tu API en producción. ¡¡Ten cuidado!!",
      "MYSQL_DATABASE": "myapp2",
      "MYSQL_HOST": "database-1.crcr91wah2lj.sa-east-1.rds.amazonaws.com",
      "MYSQL_PORT": 3306,
      "MYSQL_USER": "adminroot",
      "MYSQL_PASS": "mimamamemima123",
      "EXPRESS_PORT": 5050,
      "JWT_PASS": "mimamamemimamimama",
      "CRYPTO_KEY": "superkey",
      "REDIS_HOST": "miprimerredis.qezaxv.0001.sae1.cache.amazonaws.com",
      "REDIS_PORT": 6379
    }
  }]
};

