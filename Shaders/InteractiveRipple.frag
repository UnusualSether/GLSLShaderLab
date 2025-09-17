#version 330 core
out vec4 FragColor;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform int iMouseClick;
uniform sampler2D iChannel0;

void main()
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 mousePos = iMouse.xy / iResolution.xy;
    
    vec2 p = uv - mousePos;
    float ripple_speed = 1.5;
    float ripple_amount = 0.05;
    float dist = length(p * vec2(1.0, iResolution.y / iResolution.x));
    
    float ripple_wave = sin(dist * 20.0 - iTime * ripple_speed);
    vec2 ripple_distortion = normalize(p) * ripple_wave * ripple_amount;
    
    vec2 distortedUV = uv + ripple_distortion;
    vec3 previousFrame = texture(iChannel0, distortedUV).rgb;
    
    vec3 backgroundColor = vec3(0.0);
    backgroundColor += ripple_wave * 0.2 + 0.1;
    
    vec3 finalColor = mix(backgroundColor, previousFrame, step(0.01, length(previousFrame)));
    
    vec2 starUV = uv * 20.0;
    vec2 starId = floor(starUV);
    vec2 starLocal = fract(starUV) - 0.5;
    
    float starNoise = fract(sin(dot(starId, vec2(12.9898, 78.233))) * 43758.5453);
    if (starNoise > 0.98) {
        float starDist = length(starLocal);
        float star = 1.0 - smoothstep(0.0, 0.1, starDist);
        if (length(finalColor) < 0.1) {
            finalColor += vec3(1.0) * star * 0.3;
        }
    }
    
    float mouseDistance = distance(uv, mousePos);
    float mouseIndicator = 1.0 - smoothstep(0.005, 0.015, mouseDistance);
    finalColor = mix(finalColor, vec3(1.0, 1.0, 0.0), mouseIndicator * 0.7);
    
    if (iMouseClick == 1) {
        float paintDistance = distance(uv, mousePos);
        float paintCircle = 1.0 - smoothstep(0.05, 0.08, paintDistance);
        
        vec3 brushColor = vec3(
            0.5 + 0.5 * sin(iTime * 2.0),
            0.7,
            0.5 + 0.5 * cos(iTime * 1.5)
        );
        
        finalColor = mix(finalColor, brushColor, paintCircle * 0.9);
    }
    
    FragColor = vec4(finalColor, 1.0);
}