// Load environment variables from .env file
require("dotenv").config();

class EnvHelper {
  static envKeys = [
    "TMDB_BEARER_TOKEN",
    "OMBD_API_KEY",
    "SUPABASE_SECRET_DEFAULT_KEY",
  ];

  static TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
  static OMBD_API_KEY = process.env.OMBD_API_KEY;
  static SUPABASE_SECRET_DEFAULT_KEY = process.env.SUPABASE_SECRET_DEFAULT_KEY;


  static validate() {
    EnvHelper.envKeys.forEach((key) => {
      if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
      }
    });
  }
}

module.exports = EnvHelper;
