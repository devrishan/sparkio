import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  storeOtp,
  verifyAndConsumeOtp,
  createOrFindUser,
  cleanupExpiredOtps,
  findUserByPhone,
} from '../in-memory-store';

describe('In-memory OTP Store', () => {
  const testPhone = '919876543210';
  const testCode = '123456';

  beforeEach(() => {
    // Clear stores before each test
    // Note: In a real implementation, you'd export a clear function
  });

  describe('storeOtp', () => {
    test('stores OTP with expiry', () => {
      storeOtp(testPhone, testCode, 300);
      const result = verifyAndConsumeOtp(testPhone, testCode);
      expect(result.success).toBe(true);
      expect(result.locked).toBe(false);
    });

    test('prevents overwriting OTP when phone is locked', () => {
      // Store initial OTP
      storeOtp(testPhone, '111111', 300);
      
      // Fail verification 5 times to trigger lockout
      for (let i = 0; i < 5; i++) {
        verifyAndConsumeOtp(testPhone, '999999');
      }
      
      // Try to store new OTP - should not overwrite locked entry
      storeOtp(testPhone, '222222', 300);
      const result = verifyAndConsumeOtp(testPhone, '222222');
      
      // Should still be locked
      expect(result.locked).toBe(true);
    });
  });

  describe('verifyAndConsumeOtp', () => {
    test('accepts valid OTP', () => {
      storeOtp(testPhone, testCode, 300);
      const result = verifyAndConsumeOtp(testPhone, testCode);
      expect(result.success).toBe(true);
      expect(result.attemptsRemaining).toBe(0);
    });

    test('rejects expired OTP', async () => {
      storeOtp(testPhone, testCode, 1); // 1 second TTL
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const result = verifyAndConsumeOtp(testPhone, testCode);
      expect(result.success).toBe(false);
    });

    test('prevents reuse of consumed OTP', () => {
      storeOtp(testPhone, testCode, 300);
      verifyAndConsumeOtp(testPhone, testCode);
      const result = verifyAndConsumeOtp(testPhone, testCode);
      expect(result.success).toBe(false);
    });

    test('tracks failed attempts', () => {
      storeOtp(testPhone, testCode, 300);
      
      // Fail 3 times
      const result1 = verifyAndConsumeOtp(testPhone, '999999');
      expect(result1.success).toBe(false);
      expect(result1.attemptsRemaining).toBe(4);

      const result2 = verifyAndConsumeOtp(testPhone, '999999');
      expect(result2.success).toBe(false);
      expect(result2.attemptsRemaining).toBe(3);

      const result3 = verifyAndConsumeOtp(testPhone, '999999');
      expect(result3.success).toBe(false);
      expect(result3.attemptsRemaining).toBe(2);
    });

    test('locks account after 5 failed attempts', () => {
      storeOtp(testPhone, testCode, 300);
      
      // Fail 5 times
      for (let i = 0; i < 5; i++) {
        verifyAndConsumeOtp(testPhone, '999999');
      }
      
      const result = verifyAndConsumeOtp(testPhone, testCode);
      expect(result.locked).toBe(true);
      expect(result.success).toBe(false);
      expect(result.lockoutExpiresAt).toBeDefined();
    });

    test('rejects wrong code before lockout', () => {
      storeOtp(testPhone, testCode, 300);
      const result = verifyAndConsumeOtp(testPhone, '000000');
      expect(result.success).toBe(false);
      expect(result.locked).toBe(false);
      expect(result.attemptsRemaining).toBeGreaterThan(0);
    });
  });

  describe('createOrFindUser', () => {
    test('creates new user', () => {
      const { user, isNew } = createOrFindUser(testPhone);
      expect(isNew).toBe(true);
      expect(user.phone).toBe(testPhone);
      expect(user.role).toBe('USER');
      expect(user.referralCode).toBeDefined();
    });

    test('finds existing user', () => {
      const { user: user1 } = createOrFindUser(testPhone);
      const { user: user2, isNew } = createOrFindUser(testPhone);
      expect(isNew).toBe(false);
      expect(user2.id).toBe(user1.id);
    });

    test('associates referral code', () => {
      const { user: referrer } = createOrFindUser('919876543211');
      const { user: newUser } = createOrFindUser(testPhone, referrer.referralCode);
      expect(newUser.referredById).toBe(referrer.id);
    });
  });

  describe('cleanupExpiredOtps', () => {
    test('removes expired OTPs', async () => {
      storeOtp(testPhone, testCode, 1);
      await new Promise((resolve) => setTimeout(resolve, 1100));
      cleanupExpiredOtps();
      const result = verifyAndConsumeOtp(testPhone, testCode);
      expect(result.success).toBe(false);
    });
  });
});

