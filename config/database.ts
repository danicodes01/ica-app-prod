interface DatabaseConfig {
    name: string;
    options: {
      autoIndex: boolean;
      maxPoolSize: number;
    };
  }
  
  const config: { [key: string]: DatabaseConfig } = {
    development: {
      name: 'development',
      options: {
        autoIndex: true,
        maxPoolSize: 10,
      },
    },
    production: {
      name: 'production',
      options: {
        autoIndex: false, 
        maxPoolSize: 50,
      },
    },
  };
  
  export default config;