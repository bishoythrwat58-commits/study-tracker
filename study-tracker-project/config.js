// === إعدادات قاعدة البيانات Supabase ===
const SUPABASE_URL = "https://mqgbyqxafbfzssiglyqc.supabase.co";
const SUPABASE_KEY = "sb_publishable_bolLqJsALzL2UoWsWDXCDQ_tSXmVTpk";

// تهيئة الاتصال بقاعدة البيانات
const db = (typeof supabase !== 'undefined') 
    ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) 
    : null;