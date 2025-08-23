# 🚀 Ayrshare Business SSO Setup Guide

## ⚠️ **Current Issue: Environment Variables Not Loading**

The error you're seeing indicates that your environment variables aren't being loaded properly. Let's fix this step by step.

## 🔧 **Step 1: Create the .env.local file**

1. **In your project root directory** (same level as `package.json`), create a file called `.env.local`

2. **Copy this exact content:**

````bash
# Ayrshare Business SSO Configuration

## 🔄 **Step 2: Restart Your Development Server**

**IMPORTANT:** After creating the `.env.local` file, you MUST restart your development server.

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
````

## ✅ **Step 3: Verify Environment Variables**

1. **Visit this URL in your browser:**

   ```
   http://localhost:3000/api/debug/env
   ```

2. **You should see:**

   ```json

   ```

## 🧪 **Step 4: Test the Integration**

1. **Run the test script:**

   ```bash
   node test-ayrshare-jwt.js
   ```

2. **Navigate to your dashboard:**

   ```
   http://localhost:3000/dashboard
   ```

3. **Click "Connect Socials" button**

## 🚨 **Common Issues & Solutions**

### **Issue: "AYR_API_KEY not set"**

- **Solution:** Make sure `.env.local` is in the project root directory
- **Solution:** Restart your development server after creating the file

### **Issue: "Private key format error"**

- **Solution:** The private key should be base64 encoded without line breaks
- **Solution:** Use the exact private key provided in the example

### **Issue: "API Key not valid"**

- **Solution:** Verify your API key is correct
- **Solution:** Check that you're on the Business plan

### **Issue: Environment variables still undefined**

- **Solution:** Check file permissions on `.env.local`
- **Solution:** Make sure there are no spaces around the `=` sign
- **Solution:** Verify the file has no `.txt` extension

## 📁 **File Structure Check**

Your project should look like this:

```
ayrshare-copy/
├── .env.local          ← This file MUST be here
├── package.json
├── src/
│   └── app/
│       └── api/
│           └── ayrshare/
│               ├── sso/
│               ├── post/
│               └── profiles/
└── ...
```

## 🔍 **Debugging Steps**

1. **Check file location:**

   ```bash
   ls -la .env.local
   ```

2. **Check file content:**

   ```bash
   cat .env.local
   ```

3. **Check if Next.js is loading it:**

   ```bash
   curl http://localhost:3000/api/debug/env
   ```

4. **Check server logs** for environment variable loading messages

## 📞 **Still Having Issues?**

If you're still experiencing problems:

1. **Check the browser console** for error messages
2. **Check the terminal** where you're running `npm run dev`
3. **Verify the `.env.local` file** has the exact content shown above
4. **Make sure you restarted the server** after creating the file

The integration should work once the environment variables are properly loaded!
