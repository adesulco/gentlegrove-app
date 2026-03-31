import React, { useState, useMemo } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';
import { BODY_SIGNALS_SEEDLINGS, BODY_SIGNALS_EXPLORERS, BODY_SIGNALS_NAVIGATORS } from '../../data';
import { getRandomQuestions } from '../../utils/questionEngine';