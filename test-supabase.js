// Simple script to test Supabase connection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_KEY environment variables are not set.');
  process.exit(1);
}

console.log('Supabase URL and Key are configured.');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: tableData, error: tableError } = await supabase
      .from('registrations')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') {
        console.error('Error: The "registrations" table does not exist in your Supabase database.');
        console.log('Please create the table as described in the README.md file.');
      } else {
        console.error('Error accessing the "registrations" table:', tableError);
      }
    } else {
      console.log('✅ Successfully connected to Supabase and accessed the "registrations" table.');
      console.log(`Found ${tableData.length} records in the table.`);
      
      // Test 2: Try inserting a test record
      console.log('\nTesting record insertion...');
      const testName = 'Test User';
      const testEmail = `test-${Date.now()}@example.com`;
      
      const { data: insertData, error: insertError } = await supabase
        .from('registrations')
        .insert([{ name: testName, email: testEmail }])
        .select();
      
      if (insertError) {
        console.error('Error inserting test record:', insertError);
      } else {
        console.log('✅ Successfully inserted a test record:');
        console.log(insertData[0]);
        
        // Test 3: Delete the test record
        console.log('\nCleaning up test data...');
        const { error: deleteError } = await supabase
          .from('registrations')
          .delete()
          .eq('email', testEmail);
        
        if (deleteError) {
          console.error('Error deleting test record:', deleteError);
        } else {
          console.log('✅ Successfully deleted the test record.');
        }
      }
    }
  } catch (error) {
    console.error('Unexpected error during Supabase connection test:', error);
  }
}

testSupabaseConnection();
