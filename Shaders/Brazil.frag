#version 330 core
out vec4 FragColor;
uniform float iTime;
uniform vec2 iResolution;


void main()
{
    
    const float diamondinset = 1.7;
    const float diamondwidth = 10.0;
    const float diamondheight = 7.0;

    

    vec2 uv = gl_FragCoord.xy / iResolution.xy; 
    float prop= iResolution.x/iResolution.y;

    float diamond = midDiamond (uv, vec2(diamondwidth - diamondinset, diamondheight - diamondinset))

    FragColor = vec4(0.9961, 0.8745, 0.0000, 1.0)


    float x = length(vec2(uv.x*prop, uv.y)-vec2(prop/2.0,0.5));

    FragColor = vec4 (0.0000, 0.1529, 0.4627,  1.0);


    if(x > 0.3){
    FragColor = vec4(0,204 ,0, 1.0);
    }
}