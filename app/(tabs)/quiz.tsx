import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import gitmojis from '@/assets/gitmojis.json';

type Gitmoji = {
  emoji: string;
  code: string;
  description: string;
};

export default function QuizScreen() {
  const [question, setQuestion] = useState<Gitmoji | null>(null);
  const [options, setOptions] = useState<Gitmoji[]>([]);
  const [selected, setSelected] = useState<Gitmoji | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const getRandomGitmoji = () => {
    return gitmojis[Math.floor(Math.random() * gitmojis.length)];
  };

  const generateOptions = (correctAnswer: Gitmoji) => {
    let allOptions: Gitmoji[] = [correctAnswer];
    while (allOptions.length < 4) {
      const randomGitmoji = getRandomGitmoji();
      if (!allOptions.some(opt => opt.code === randomGitmoji.code)) {
        allOptions.push(randomGitmoji);
      }
    }
    return allOptions.sort(() => Math.random() - 0.5);
  };

  const newQuestion = () => {
    setSelected(null);
    setIsCorrect(null);
    const correct = getRandomGitmoji();
    setQuestion(correct);
    setOptions(generateOptions(correct));
  };

  useEffect(() => {
    newQuestion();
  }, []);

  const handleSelect = (option: Gitmoji) => {
    setSelected(option);
    setIsCorrect(option.code === question?.code);
  };

  return (
    <ThemedView style={styles.container}>
      {question && (
        <>
          <ThemedText style={styles.description}>{question.description}</ThemedText>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <Pressable
                key={option.code}
                onPress={() => handleSelect(option)}
                style={[styles.option, selected?.code === option.code && (isCorrect ? styles.correct : styles.incorrect)]}
                disabled={selected !== null}
              >
                <Text style={styles.emoji}>{option.emoji}</Text>
              </Pressable>
            ))}
          </View>
          {selected && (
            <View style={styles.resultContainer}>
                <ThemedText style={isCorrect ? styles.correctText: styles.incorrectText}>{isCorrect ? 'Correct!' : 'Incorrect!'}</ThemedText>
              <Pressable onPress={newQuestion} style={styles.nextButton}>
                <ThemedText>Next Question</ThemedText>
              </Pressable>
            </View>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  description: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  option: {
    width: 120,
    height: 120,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  emoji: {
    fontSize: 60,
  },
  correct: {
    borderColor: 'green',
  },
  incorrect: {
    borderColor: 'red',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  correctText: {
    color: 'green',
    fontSize: 20,
    marginBottom: 10,
  },
  incorrectText: {
    color: 'red',
    fontSize: 20,
    marginBottom: 10,
  },
  nextButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
});
