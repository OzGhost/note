# note

my note online 
vim link:
https://drive.google.com/file/d/0B7jSA-dsfHCvRDRXVUs2UDB3LUE/view?usp=sharing

bash prompt config: PS1="\[\\e[0;96m\] % \[\\e[m\]"


xresource colorscheme: https://github.com/chriskempson/base16-xresources

 ffmpeg -f x11grab -video_size 1140x720 -framerate 25 -i :0.0 -vcodec h264 /tmp/out.mkv  
 ffmpeg -f x11grab -video_size 1280x720 -framerate 25 -i :0.0 -vcodec libvpx /tmp/out_v3.webm
 
 first: https://github.com/jashkenas/underscore
 second: https://lodash.com/ (https://github.com/lodash/lodash/tree/4.17.4)

9 mistake when people come to css grid: https://hacks.mozilla.org/2018/07/9-biggest-mistakes-with-css-grid/?utm_source=dev-newsletter&utm_medium=email&utm_campaign=july26-2018&utm_content=csslayout

object oriented css: https://github.com/stubbornella/oocss/wiki

9gag: [
  https://9gag.com/gag/agXRKRn
]

wmname LG3D

js iterator pattern
https://loige.co/javascript-iterator-patterns/

hacker tools: https://hacker-tools.github.io/

/etc/sysctl.d/10-custom-kernel-bbr.conf
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr

ffmpeg -i src/001.mp4 -ss 00:06:34.0 -to 00:09:24.0 -c copy output.mp4
ffmpeg -i src/001.mp4 -ss 00:06:34.0 -to 00:09:24.0 -target ntsc-svcd output.mpg

git log --pretty=format:"%h - %an, %ar : %s" path/to/file

---
# Vision summaries
_the number is relatively correct_

- Working time: 366 - 52*2 - 11 = 251 days ~ 2008 hours
- Total:
    - 367 stories
    - 3,204 technical tasks -> 8 tasks/story
        - Duc:   451 -> 4.452 hours/task
        - Duy:   421 -> 4.769 hours/task
        - Hoai:  373 -> 5.383 hours/task
        - Thanh: 370 -> 5.427 hours/task
        - Ngan:  335 -> 5.994 hours/task
        - Lan:   314 -> 6.394 hours/task
---

# i3 color set
```
# class                 border  backgr. text    indicator child_border
client.focused          #d21f3c #d21f3c #ffffff #d21f3c #d21f3c
client.focused_inactive #222222 #222222 #888888 #222222 #222222
client.unfocused        #222222 #222222 #888888 #222222 #222222
client.urgent           #900000 #900000 #ffffff #900000 #900000
client.placeholder      #0c0c0c #0c0c0c #ffffff #0c0c0c #0c0c0c
```
