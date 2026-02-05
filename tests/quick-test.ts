/**
 * Quick Test Suite - Mobeng Recruitment Portal v3.0
 * Run this to verify all critical features are working
 */

import { supabase, testSupabaseConnection, getSupabaseStatus } from '../services/supabaseClient';
import { getServicesStatus, logServicesStatus } from '../services/externalServices';
import { monitoring, setupGlobalErrorHandler } from '../services/monitoring';

// ============================================
// TEST SUITE
// ============================================

export class QuickTestSuite {
  private testResults: { name: string; status: 'pass' | 'fail'; message: string }[] = [];

  /**
   * Run all tests
   */
  async runAll() {
    console.clear();
    console.log('🧪 MOBENG RECRUITMENT PORTAL - QUICK TEST SUITE');
    console.log('='.repeat(50));
    console.log('');

    await this.testSupabaseConnection();
    await this.testExternalServices();
    await this.testMonitoring();
    await this.testLocalStorage();

    this.printResults();
  }

  /**
   * Test Supabase Connection
   */
  private async testSupabaseConnection() {
    console.log('📊 Testing Supabase Connection...');

    try {
      const status = getSupabaseStatus();

      if (!status.ready) {
        this.addResult('Supabase Config', 'fail', `URL: ${status.url}, Key: ${status.key}`);
        return;
      }

      const connection = await testSupabaseConnection();

      if (connection.success) {
        this.addResult('Supabase Connection', 'pass', 'Connected successfully');
      } else {
        this.addResult('Supabase Connection', 'fail', connection.error || 'Unknown error');
      }

      // Test table access
      try {
        const { data, error } = await supabase
          .from('question_sets')
          .select('count', { count: 'exact', head: true });

        if (!error) {
          this.addResult('Supabase Tables', 'pass', 'Can access question_sets table');
        } else {
          this.addResult('Supabase Tables', 'fail', error.message);
        }
      } catch (err) {
        this.addResult('Supabase Tables', 'fail', String(err));
      }
    } catch (error) {
      this.addResult('Supabase Connection', 'fail', String(error));
    }

    console.log('');
  }

  /**
   * Test External Services
   */
  private async testExternalServices() {
    console.log('🔧 Testing External Services...');

    try {
      const status = getServicesStatus();

      this.addResult(
        'Supabase Config',
        status.supabase.configured ? 'pass' : 'fail',
        status.supabase.error || 'Configured'
      );

      this.addResult(
        'Gemini Config',
        status.gemini.configured ? 'pass' : 'fail',
        status.gemini.error || 'Configured'
      );

      this.addResult(
        'SendGrid Config',
        status.sendgrid.configured ? 'pass' : 'fail',
        status.sendgrid.error || 'Configured'
      );

      this.addResult(
        'Twilio Config',
        status.twilio.configured ? 'pass' : 'fail',
        status.twilio.error || 'Configured'
      );

      logServicesStatus();
    } catch (error) {
      this.addResult('External Services', 'fail', String(error));
    }

    console.log('');
  }

  /**
   * Test Monitoring
   */
  private async testMonitoring() {
    console.log('📈 Testing Monitoring...');

    try {
      setupGlobalErrorHandler();
      this.addResult('Global Error Handler', 'pass', 'Setup successful');

      // Test logging
      monitoring.logInfo('Test info message');
      monitoring.logWarning('Test warning message');
      monitoring.trackMetric('Test Metric', 100, 'ms');

      const stats = monitoring.getErrorStats();
      this.addResult('Monitoring Logs', 'pass', `${stats.total} logs recorded`);

      const perfStats = monitoring.getPerformanceStats();
      this.addResult('Performance Tracking', 'pass', `${perfStats.count} metrics recorded`);
    } catch (error) {
      this.addResult('Monitoring', 'fail', String(error));
    }

    console.log('');
  }

  /**
   * Test Local Storage
   */
  private async testLocalStorage() {
    console.log('💾 Testing Local Storage...');

    try {
      // Test write
      const testKey = 'mobeng_test_key';
      const testValue = 'test_value_' + Date.now();

      localStorage.setItem(testKey, testValue);
      this.addResult('LocalStorage Write', 'pass', 'Data written successfully');

      // Test read
      const retrieved = localStorage.getItem(testKey);

      if (retrieved === testValue) {
        this.addResult('LocalStorage Read', 'pass', 'Data read successfully');
      } else {
        this.addResult('LocalStorage Read', 'fail', 'Data mismatch');
      }

      // Test delete
      localStorage.removeItem(testKey);
      const deleted = localStorage.getItem(testKey);

      if (deleted === null) {
        this.addResult('LocalStorage Delete', 'pass', 'Data deleted successfully');
      } else {
        this.addResult('LocalStorage Delete', 'fail', 'Data not deleted');
      }

      // Check storage quota
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const percentUsed = Math.round((estimate.usage! / estimate.quota!) * 100);
        this.addResult('Storage Quota', 'pass', `${percentUsed}% used`);
      }
    } catch (error) {
      this.addResult('Local Storage', 'fail', String(error));
    }

    console.log('');
  }

  /**
   * Add test result
   */
  private addResult(name: string, status: 'pass' | 'fail', message: string) {
    this.testResults.push({ name, status, message });
  }

  /**
   * Print results
   */
  private printResults() {
    console.log('📋 TEST RESULTS');
    console.log('='.repeat(50));
    console.log('');

    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;

    // Print each result
    this.testResults.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : '❌';
      console.log(`${icon} ${result.name}`);
      console.log(`   ${result.message}`);
    });

    console.log('');
    console.log('='.repeat(50));
    console.log(`Total: ${this.testResults.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log('');

    if (failed === 0) {
      console.log('🎉 ALL TESTS PASSED!');
    } else {
      console.log(`⚠️  ${failed} test(s) failed. Please review above.`);
    }

    console.log('');
    console.log('📊 Monitoring Stats:');
    console.log('   Errors:', monitoring.getErrorStats());
    console.log('   Performance:', monitoring.getPerformanceStats());
    console.log('');
  }
}

/**
 * Run tests from browser console
 */
export const runQuickTests = async () => {
  const suite = new QuickTestSuite();
  await suite.runAll();
};

// Auto-run tests on module load (development only)
if (import.meta.env.DEV) {
  console.log('💡 Tip: Run runQuickTests() in console to test all features');
}
