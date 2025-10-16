const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🚀 AI Schedule App Setup')
console.log('========================\n')

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setup() {
  console.log('This script will help you configure your environment variables.\n')
  
  try {
    const supabaseUrl = await question('Enter your Supabase URL: ')
    const supabaseAnonKey = await question('Enter your Supabase Anon Key: ')
    const supabaseServiceKey = await question('Enter your Supabase Service Role Key: ')
    const googleAiKey = await question('Enter your Google AI API Key: ')
    
    const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# AI Configuration
GOOGLE_AI_API_KEY=${googleAiKey}
`
    
    fs.writeFileSync('.env.local', envContent)
    
    console.log('\n✅ Environment variables configured successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Make sure you have run the SQL script in supabase/schema.sql')
    console.log('2. Run "npm run dev" to start the development server')
    console.log('3. Open http://localhost:3000 in your browser')
    console.log('\n🎉 Your AI Schedule App is ready to use!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  } finally {
    rl.close()
  }
}

setup()
