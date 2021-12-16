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

chrome://net-internals/#hsts

# i3 color set
```
# class                 border  backgr. text    indicator child_border
client.focused          #d21f3c #d21f3c #ffffff #d21f3c #d21f3c
client.focused_inactive #222222 #222222 #888888 #222222 #222222
client.unfocused        #222222 #222222 #888888 #222222 #222222
client.urgent           #900000 #900000 #ffffff #900000 #900000
client.placeholder      #0c0c0c #0c0c0c #ffffff #0c0c0c #0c0c0c
```

# Half ass auto log disclose

| Candidate | Auto | Act on non-rs | Rs code based | Exception based | Low risk | Error ID matching | Dynamic error ignore |
| :- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| RsIntercepter only | x | | x | | x | | |
| ThreadLocal | | x | x | x | | x | x |

* Auto: No more stuff need to be done after install
* Act on non-rs: Work on request which haven't reach the destination yet (ex: connection refuse)
* Rs code based: Detect failure based on response's status code
* Exception based: Detect failure based on exception which thrown on client invoke
* Low risk: The number of un-direct-supported feature will be used will be low
* Error ID matching: Request, Response and Error log will have the same error code
* Dynamic error ignore: Conditionally ignore an error for each invocation


# Anim3 wishlist
```
- UQ holder
- Aho girl
- Armed girl's machiavellism
- Monster Musume: Everyday life with monster girls
- Kishuku gakkou no Juliet
- Handa-kun
- Hidan no aria
- Rewrite
- Suppose a Kid from the Last Dungeon Boonies moved to a starter town?
- Mayo chiki
- Gekkan shoujo Nozaki-kun
- Nisekoi
- Bokutachi wa Benkyou ga Dekinai
- Tokyo Ravens
- Infinite Stratos
- Fullmetal Alchemist: Brotherhood
- Omamori Himari
- Scissor Seven
- Nichijou
- Kobayashi-san chi no maid Dragon
- Amagi Brilliant Park
- Asobi Asobase
- Maken-ki
- Rokujouma no Shinryakusha
- Rakudai Kishi no Cavalry
- Saenai Heroine no Sodatekata Fine
- Gamers
- DanMachi
- Horimiya
- Inou-Battle wa Nichijou-kei no Naka de
- Demi-chan wa Kataritai
- Tsuujou Kougeki ga Zentai Kougeki de Ni-kai Kougeki no Okaasan wa Suki Desu ka?
- The Hidden dungeon only I can enter
- Kiss x Sis
- Bofuri: i don't want to get hurt, So I'll max out my defense
- Kaguya-sama: Love is war
- Oreshura
- Gakusen Toshi Asterisk
- Tsukimichi - moonlit fantasy -
- Cyphers
- Keppeki Danshi! Aoyama-Kun
- Senryuu Shoujo
- This art club has a problem
- Tsugu Tsugumomo
- Seto no Hanayome
- The mistfit of demon king academy
- Uzaki-chan wa Asobitai
```

