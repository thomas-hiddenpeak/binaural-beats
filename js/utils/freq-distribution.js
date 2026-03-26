/**
 * 频率分配策略 (Strategy Pattern)
 * symmetric:    双耳对称 ±½ beat
 * left:         仅左耳下移
 * right:        仅右耳上移
 * alternating:  对称分配 + 定时左右交替（降低单耳疲劳）
 */

const strategies = {
  symmetric: {
    pure(carrier, beat) {
      return { left: carrier - beat / 2, right: carrier + beat / 2 };
    },
    music(beat) {
      return { left: -beat / 2, right: beat / 2 };
    },
    drone(center, beat) {
      return { left: center - beat / 2, right: center + beat / 2 };
    }
  },
  left: {
    pure(carrier, beat) {
      return { left: carrier - beat, right: carrier };
    },
    music(beat) {
      return { left: -beat, right: 0 };
    },
    drone(center, beat) {
      return { left: center - beat, right: center };
    }
  },
  right: {
    pure(carrier, beat) {
      return { left: carrier, right: carrier + beat };
    },
    music(beat) {
      return { left: 0, right: beat };
    },
    drone(center, beat) {
      return { left: center, right: center + beat };
    }
  }
};

// "alternating" 使用与 symmetric 相同的静态计算，但通过 swapped 参数翻转方向
// 实际的交替定时逻辑由各 mode 类管理
function _symmetric(method, args, swapped) {
  const result = strategies.symmetric[method](...args);
  if (swapped) {
    return { left: result.right, right: result.left };
  }
  return result;
}

export function getStrategy(name) {
  return strategies[name] || strategies.symmetric;
}

export function isAlternating(distName) {
  return distName === 'alternating';
}

export function getPureFreqs(carrier, beat, distName, swapped = false) {
  if (distName === 'alternating') return _symmetric('pure', [carrier, beat], swapped);
  return getStrategy(distName).pure(carrier, beat);
}

export function getMusicShifts(beat, distName, swapped = false) {
  if (distName === 'alternating') return _symmetric('music', [beat], swapped);
  return getStrategy(distName).music(beat);
}

export function getDroneFreqs(baseFreq, ratio, beat, distName, swapped = false) {
  const center = baseFreq * ratio;
  if (distName === 'alternating') return _symmetric('drone', [center, beat], swapped);
  return getStrategy(distName).drone(center, beat);
}

export const DIST_LABELS = {
  symmetric: '对称分配',
  left: '仅左耳频移',
  right: '仅右耳频移',
  alternating: '左右交替'
};
