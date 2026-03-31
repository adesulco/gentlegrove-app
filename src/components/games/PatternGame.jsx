import React, { useState, useMemo } from 'react';

import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';

import { PTTERSNS_SEEDLINGS, PATTERNS_EXPLORERS, PATtERNS_NAVIGATORS } from '../../data';
import { getRandomQuestions } from '../../utils/questionEngine';
