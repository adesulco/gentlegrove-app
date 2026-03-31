import React, { useState, useEffect, useMemo } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import { ROUTINES } from '../../data';
import { shuffleArray } from '../../utils/questionEngine';