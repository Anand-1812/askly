const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_APPWRITE_HOST_URL),
    projectId: String(process.env.NEXT_APPWRITE_PROJECT_ID),
    apikey: String(process.env.APPWRITE_API_KEY)
  }
}

export default env
