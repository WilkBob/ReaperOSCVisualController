# CONSTANTS Documentation

## PARTICLE_CONTROLS

- **COLOR_SCHEMES**: Predefined color schemes for particles.
- **PARTICLE_TYPES**: `['circle', 'square', 'triangle', 'star']`
- **TRAIL_EFFECT**: `true` (default).
- **GRAVITY_EFFECT**: `0.03`
- **WIND_EFFECT**: Randomized every 5 seconds.
- **EXPLOSION_FORCE**: `12`
- **PARTICLE_COUNT**: `30`
- **MAX_PARTICLES**: `500`
- **PARTICLE_SIZE_RANGE**: `{ MIN: 5, MAX: 15 }`
- **PARTICLE_LIFE_RANGE**: `{ MIN: 80, MAX: 150 }`
- **CONNECTION_DISTANCE**: `80`
- **CONNECTION_OPACITY_DIVISOR**: `2`

## SPACE_CONTROLS

- **PLANETS**:
  - `RADIUS_FRACTION`, `DISTANCE_FRACTION`, and `SPEED` for each planet.
  - Example: `Planet 1` has `RADIUS_FRACTION: 0.02`, `DISTANCE_FRACTION: 0.3`, `SPEED: 0.017`.

## SUN

- **RADIUS_FRACTION**: `0.06`
- **GLOW_FRACTION**: `0.02`
- **ACTIVE_RADIUS_MULTIPLIER**: `1.4`
- **ACTIVE_GLOW_MULTIPLIER**: `2.0`
- **RAY_COUNT**: `12`
- **RAY_LENGTH**: `0.5`

## BALL

- **GLOW_SIZE**: Initial glow size (`10`).
- **GLOW_DIRECTION**: Direction of glow size change (`1` for increasing, `-1` for decreasing).
- **GLOWSPEED**: Speed of the glow pulsing (`0.5`).
- **BALL_SIZE**: Size of the ball (`15`).
- **GLOW_SIZE_MAX**: Maximum glow size (`50`).
- **GLOW_SIZE_MIN**: Minimum glow size (`10`).
- **GRADIENT_COLOR_START**: Gradient start color (`"rgba(255, 255, 255, 0.8)"`).
- **GRADIENT_COLOR_END**: Gradient end color (`"rgba(255, 255, 255, 0)"`).
- **BALL_COLOR**: Ball color (`"rgba(255, 255, 255, 0.9)"`).
