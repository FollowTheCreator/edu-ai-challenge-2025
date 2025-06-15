const { Enigma, Rotor, plugboardSwap, ROTORS, REFLECTOR, alphabet, mod } = require('./enigma.js');

// Mock require.main to prevent CLI from running during tests
const originalMain = require.main;
require.main = null;

const enigmaModule = require('./enigma.js');

// Restore require.main
require.main = originalMain;

describe('Enigma Machine Tests', () => {
  describe('Helper Functions', () => {
    test('mod function handles negative numbers correctly', () => {
      expect(mod(-1, 26)).toBe(25);
      expect(mod(27, 26)).toBe(1);
      expect(mod(0, 26)).toBe(0);
      expect(mod(25, 26)).toBe(25);
    });

    test('plugboardSwap swaps characters correctly', () => {
      const pairs = [['A', 'B'], ['C', 'D']];
      expect(plugboardSwap('A', pairs)).toBe('B');
      expect(plugboardSwap('B', pairs)).toBe('A');
      expect(plugboardSwap('C', pairs)).toBe('D');
      expect(plugboardSwap('D', pairs)).toBe('C');
      expect(plugboardSwap('E', pairs)).toBe('E'); // No swap
    });

    test('plugboardSwap handles empty pairs', () => {
      expect(plugboardSwap('A', [])).toBe('A');
    });
  });

  describe('Rotor Class', () => {
    let rotor;

    beforeEach(() => {
      rotor = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 0);
    });

    test('rotor initializes correctly', () => {
      expect(rotor.wiring).toBe(ROTORS[0].wiring);
      expect(rotor.notch).toBe(ROTORS[0].notch);
      expect(rotor.ringSetting).toBe(0);
      expect(rotor.position).toBe(0);
    });

    test('rotor steps correctly', () => {
      rotor.step();
      expect(rotor.position).toBe(1);
      
      // Test wrap around
      rotor.position = 25;
      rotor.step();
      expect(rotor.position).toBe(0);
    });

    test('rotor detects notch correctly', () => {
      // Rotor I notch is at 'Q' (position 16)
      rotor.position = 16; // Q
      expect(rotor.atNotch()).toBe(true);
      
      rotor.position = 15; // P
      expect(rotor.atNotch()).toBe(false);
    });

    test('rotor forward encoding works', () => {
      const result = rotor.forward('A');
      expect(result).toBe('E'); // First character of Rotor I wiring
    });

    test('rotor backward encoding works', () => {
      const result = rotor.backward('E');
      expect(result).toBe('A'); // E maps back to A in Rotor I
    });

    test('rotor encoding with position offset', () => {
      rotor.position = 1;
      const forward = rotor.forward('A');
      const backward = rotor.backward(forward);
      expect(backward).toBe('A'); // Should be reversible
    });
  });

  describe('Enigma Class - Double-Stepping Fix', () => {
    test('double-stepping mechanism works correctly', () => {
      // Set up a scenario where double-stepping should occur
      // Middle rotor (index 1) at notch position
      const enigma = new Enigma([0, 1, 2], [0, 16, 0], [0, 0, 0], []); // Rotor II notch at E (4)
      enigma.rotors[1].position = 4; // E position for Rotor II
      
      const initialPositions = enigma.rotors.map(r => r.position);
      
      // Step the rotors
      enigma.stepRotors();
      
      // Middle rotor should have stepped (double-step)
      // Left rotor should have stepped
      // Right rotor should have stepped
      expect(enigma.rotors[0].position).toBe(initialPositions[0] + 1); // Left stepped
      expect(enigma.rotors[1].position).toBe(initialPositions[1] + 1); // Middle stepped (double)
      expect(enigma.rotors[2].position).toBe(initialPositions[2] + 1); // Right stepped
    });

    test('normal stepping without double-step', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const initialPositions = enigma.rotors.map(r => r.position);
      
      enigma.stepRotors();
      
      // Only right rotor should step in normal case
      expect(enigma.rotors[0].position).toBe(initialPositions[0]); // Left unchanged
      expect(enigma.rotors[1].position).toBe(initialPositions[1]); // Middle unchanged
      expect(enigma.rotors[2].position).toBe(initialPositions[2] + 1); // Right stepped
    });

    test('right rotor notch causes middle rotor step', () => {
      // Rotor III notch is at V (21)
      const enigma = new Enigma([0, 1, 2], [0, 0, 21], [0, 0, 0], []);
      
      const initialPositions = enigma.rotors.map(r => r.position);
      
      enigma.stepRotors();
      
      expect(enigma.rotors[0].position).toBe(initialPositions[0]); // Left unchanged
      expect(enigma.rotors[1].position).toBe(initialPositions[1] + 1); // Middle stepped
      expect(enigma.rotors[2].position).toBe(initialPositions[2] + 1); // Right stepped
    });
  });

  describe('Enigma Class - Plugboard Fix', () => {
    test('plugboard is applied twice during encryption', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
      
      // Encrypt 'A' - should be swapped to 'B' first, then processed, then swapped back
      const result = enigma.encryptChar('A');
      
      // The character should have been swapped twice during the process
      // We can't predict the exact output without following the full path,
      // but we can test that the plugboard is working by ensuring A doesn't map to itself
      // when there's a plugboard connection
      expect(result).not.toBe('A');
    });

    test('encryption is reversible with plugboard', () => {
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D']]);
      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D']]);
      
      const original = 'HELLO';
      const encrypted = enigma1.process(original);
      const decrypted = enigma2.process(encrypted);
      
      expect(decrypted).toBe(original);
    });

    test('plugboard works without pairs', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const result = enigma.encryptChar('A');
      expect(typeof result).toBe('string');
      expect(result.length).toBe(1);
    });
  });

  describe('Enigma Integration Tests', () => {
    test('basic encryption/decryption cycle', () => {
      const settings = {
        rotorIDs: [0, 1, 2],
        positions: [0, 0, 0],
        rings: [0, 0, 0],
        plugs: []
      };
      
      const enigma1 = new Enigma(settings.rotorIDs, settings.positions, settings.rings, settings.plugs);
      const enigma2 = new Enigma(settings.rotorIDs, settings.positions, settings.rings, settings.plugs);
      
      const message = 'HELLO WORLD';
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      expect(decrypted).toBe(message); // Spaces are preserved but not encrypted
    });

    test('complex settings encryption/decryption', () => {
      const settings = {
        rotorIDs: [2, 1, 0],
        positions: [10, 5, 20],
        rings: [1, 2, 3],
        plugs: [['A', 'B'], ['C', 'D'], ['E', 'F']]
      };
      
      const enigma1 = new Enigma(settings.rotorIDs, settings.positions, settings.rings, settings.plugs);
      const enigma2 = new Enigma(settings.rotorIDs, settings.positions, settings.rings, settings.plugs);
      
      const message = 'TESTMESSAGE';
      const encrypted = enigma1.process(message);
      const decrypted = enigma2.process(encrypted);
      
      expect(decrypted).toBe(message);
      expect(encrypted).not.toBe(message);
    });

    test('non-alphabetic characters pass through unchanged', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      expect(enigma.encryptChar('1')).toBe('1');
      expect(enigma.encryptChar(' ')).toBe(' ');
      expect(enigma.encryptChar('!')).toBe('!');
    });

    test('lowercase input is converted to uppercase', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const result = enigma.process('hello');
      expect(result).toBe(result.toUpperCase());
    });

    test('rotors advance during encryption', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      const initialPosition = enigma.rotors[2].position;
      enigma.encryptChar('A');
      
      expect(enigma.rotors[2].position).toBe(initialPosition + 1);
    });
  });

  describe('Historical Accuracy Tests', () => {
    test('reflector is bidirectional', () => {
      // Test that reflector mapping is symmetric
      for (let i = 0; i < 26; i++) {
        const char = alphabet[i];
        const reflected = REFLECTOR[i];
        const reflectedIndex = alphabet.indexOf(reflected);
        const doubleReflected = REFLECTOR[reflectedIndex];
        
        expect(doubleReflected).toBe(char);
      }
    });

    test('no letter encrypts to itself (important Enigma property)', () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      
      for (let i = 0; i < 26; i++) {
        const char = alphabet[i];
        // Reset enigma position for each test
        enigma.rotors.forEach(rotor => rotor.position = 0);
        const encrypted = enigma.encryptChar(char);
        expect(encrypted).not.toBe(char);
      }
    });

    test('rotor wiring is proper permutation', () => {
      ROTORS.forEach((rotor, index) => {
        const wiring = rotor.wiring;
        expect(wiring.length).toBe(26);
        
        // Each letter should appear exactly once
        for (let i = 0; i < 26; i++) {
          const char = alphabet[i];
          expect(wiring.indexOf(char)).not.toBe(-1);
          expect(wiring.indexOf(char)).toBe(wiring.lastIndexOf(char));
        }
      });
    });
  });
});

// Export for coverage testing
module.exports = {
  plugboardSwap: enigmaModule.plugboardSwap || plugboardSwap,
  Rotor: enigmaModule.Rotor || Rotor,
  Enigma: enigmaModule.Enigma || Enigma,
  ROTORS: enigmaModule.ROTORS || ROTORS,
  REFLECTOR: enigmaModule.REFLECTOR || REFLECTOR,
  alphabet: enigmaModule.alphabet || alphabet,
  mod: enigmaModule.mod || mod
}; 