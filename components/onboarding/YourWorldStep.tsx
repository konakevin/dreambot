import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import type { DreamSeeds } from '@/types/vibeProfile';
import { colors } from '@/constants/theme';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

type SeedCategory = keyof DreamSeeds;

interface CategoryConfig {
  key: SeedCategory;
  title: string;
  icon: string;
  placeholder: string;
  suggestions: string[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'characters',
    title: 'Characters',
    icon: 'people',
    placeholder: 'Who shows up in your dreams?',
    suggestions: ['my cat', 'astronauts', 'tiny monsters', 'robots', 'a fox', 'dragons'],
  },
  {
    key: 'places',
    title: 'Places',
    icon: 'location',
    placeholder: 'Where do your dreams happen?',
    suggestions: [
      'abandoned malls',
      'Tokyo at night',
      'underwater cities',
      'a cozy cabin',
      'the moon',
      'a rooftop at sunset',
    ],
  },
  {
    key: 'things',
    title: 'Things',
    icon: 'cube',
    placeholder: 'Objects, foods, whatever you love',
    suggestions: ['donuts', 'guitars', 'neon signs', 'crystals', 'old books', 'vintage cameras'],
  },
];

function SeedInput({
  config,
  seeds,
  onAdd,
  onRemove,
}: {
  config: CategoryConfig;
  seeds: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [input, setInput] = useState('');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleSuggestion(suggestion: string) {
    if (seeds.includes(suggestion)) {
      onRemove(suggestion);
    } else {
      onAdd(suggestion);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <View style={s.categoryCard}>
      <View style={s.categoryHeader}>
        <Ionicons
          name={config.icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={colors.accent}
        />
        <Text style={s.categoryTitle}>{config.title}</Text>
      </View>

      {/* Input row */}
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          placeholder={config.placeholder}
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          maxLength={40}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[s.addButton, !input.trim() && s.addButtonDisabled]}
          onPress={handleAdd}
          activeOpacity={0.7}
          disabled={!input.trim()}
        >
          <Ionicons name="add" size={20} color={input.trim() ? '#FFFFFF' : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Added seeds */}
      {seeds.length > 0 && (
        <View style={s.tagRow}>
          {seeds.map((seed) => (
            <TouchableOpacity
              key={seed}
              style={s.tag}
              onPress={() => {
                onRemove(seed);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.7}
            >
              <Text style={s.tagText}>{seed}</Text>
              <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Suggestions */}
      <View style={s.tagRow}>
        {config.suggestions
          .filter((sug) => !seeds.includes(sug))
          .map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={s.suggestionTag}
              onPress={() => handleSuggestion(suggestion)}
              activeOpacity={0.7}
            >
              <Text style={s.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const AVOID_SUGGESTIONS = [
  'spiders',
  'clowns',
  'gore',
  'snakes',
  'dolls',
  'heights',
  'deep water',
  'crowds',
];

export function YourWorldStep({ onNext, onBack }: Props) {
  const dreamSeeds = useOnboardingStore((s) => s.profile.dream_seeds);
  const addSeed = useOnboardingStore((s) => s.addSeed);
  const removeSeed = useOnboardingStore((s) => s.removeSeed);
  const avoid = useOnboardingStore((s) => s.profile.avoid);
  const addAvoid = useOnboardingStore((s) => s.addAvoid);
  const removeAvoid = useOnboardingStore((s) => s.removeAvoid);
  const [avoidInput, setAvoidInput] = useState('');

  const totalSeeds =
    dreamSeeds.characters.length + dreamSeeds.places.length + dreamSeeds.things.length;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <Text style={s.title}>Fill its head</Text>
        <Text style={s.subtitle}>
          {`Just name things you love. Your DreamBot will remix, mash up, and dream about them in ways you'd never expect.`}
        </Text>

        {/* Three seed categories */}
        {CATEGORIES.map((cat) => (
          <SeedInput
            key={cat.key}
            config={cat}
            seeds={dreamSeeds[cat.key]}
            onAdd={(v) => addSeed(cat.key, v)}
            onRemove={(v) => removeSeed(cat.key, v)}
          />
        ))}

        {/* Avoid list */}
        <View style={s.categoryCard}>
          <View style={s.categoryHeader}>
            <Ionicons name="ban" size={18} color={colors.like} />
            <Text style={s.categoryTitle}>Things to avoid</Text>
          </View>

          <View style={s.inputRow}>
            <TextInput
              style={s.input}
              placeholder="Anything you don't want to see"
              placeholderTextColor={colors.textMuted}
              value={avoidInput}
              onChangeText={setAvoidInput}
              onSubmitEditing={() => {
                if (avoidInput.trim()) {
                  addAvoid(avoidInput);
                  setAvoidInput('');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              returnKeyType="done"
              maxLength={40}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[
                s.addButton,
                { backgroundColor: colors.like },
                !avoidInput.trim() && s.addButtonDisabled,
              ]}
              onPress={() => {
                if (avoidInput.trim()) {
                  addAvoid(avoidInput);
                  setAvoidInput('');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              activeOpacity={0.7}
              disabled={!avoidInput.trim()}
            >
              <Ionicons
                name="add"
                size={20}
                color={avoidInput.trim() ? '#FFFFFF' : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {avoid.length > 0 && (
            <View style={s.tagRow}>
              {avoid.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[s.tag, { backgroundColor: colors.like }]}
                  onPress={() => {
                    removeAvoid(item);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.tagText}>{item}</Text>
                  <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={s.tagRow}>
            {AVOID_SUGGESTIONS.filter((sug) => !avoid.includes(sug)).map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={s.suggestionTag}
                onPress={() => {
                  if (avoid.includes(suggestion)) {
                    removeAvoid(suggestion);
                  } else {
                    addAvoid(suggestion);
                  }
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                activeOpacity={0.7}
              >
                <Text style={s.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <View style={s.footerRow}>
          <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={s.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.nextBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onNext();
            }}
            activeOpacity={0.7}
          >
            <Text style={s.nextBtnText}>{totalSeeds === 0 ? 'Skip' : 'Next'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 15, marginBottom: 20, lineHeight: 22 },

  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionTag: {
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  footer: { paddingHorizontal: 20, paddingBottom: 16 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  backBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
  },
  nextBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
