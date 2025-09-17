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
    
    vec3 previousFrame = texture(iChannel0, uv).rgb;
    
    vec3 backgroundColor = mix(
        vec3(0.2, 0.1, 0.4),
        vec3(0.1, 0.3, 0.6),
        uv.y
    );
    
    vec2 center = vec2(0.5, 0.5);
    float distFromCenter = distance(uv, center);
    
    float sticky_mask = 1.0 - smoothstep(0.2, 0.3, distFromCenter);

    float outside_fade_rate = 0.95;
    vec3 fadedPreviousFrame = mix(previousFrame * outside_fade_rate, previousFrame, sticky_mask);
    
    vec3 finalColor = mix(backgroundColor, fadedPreviousFrame, step(0.01, length(fadedPreviousFrame)));
    
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