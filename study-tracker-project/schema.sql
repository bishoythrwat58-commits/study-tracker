-- شغّل هذا الكود كاملاً في SQL Editor داخل Supabase
-- (لو عندك جداول قديمة اسمها users و tasks احذفها الأول: DROP TABLE tasks, users CASCADE;)

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  grade TEXT DEFAULT '',
  parent_name TEXT DEFAULT '',
  parent_phone TEXT DEFAULT '',
  streak INT DEFAULT 0,
  last_active DATE,
  total_completed INT DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  text TEXT NOT NULL,
  subject TEXT DEFAULT '',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  day INT NOT NULL CHECK (day BETWEEN 0 AND 6), -- 0 = السبت ... 6 = الجمعة
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  note TEXT DEFAULT '',
  color TEXT DEFAULT '#2dd4bf'
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  minutes INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء الملف الشخصي تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, grade, parent_name, parent_phone)
  VALUES (NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'name',''), NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'grade',''),
          COALESCE(NEW.raw_user_meta_data->>'parent_name',''),
          COALESCE(NEW.raw_user_meta_data->>'parent_phone',''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- الأمان: كل طالب يشوف بياناته هو بس
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own tasks" ON tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own blocks" ON schedule_blocks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own sessions" ON focus_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- الأدمن: بعد ما تسجل بحسابك شغّل:  UPDATE profiles SET is_admin = true WHERE email = 'ايميلك';
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT is_admin FROM profiles WHERE id = auth.uid()), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "admin reads profiles" ON profiles FOR SELECT USING (is_admin());
