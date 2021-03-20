
colorscheme elflord
set background=dark

set tabstop=2
set shiftwidth=2
set expandtab
set smarttab

set autoindent
set smartindent

set autoread
set ignorecase
set nocompatible
set showcmd


call plug#begin('~/.vim/plugged')

Plug 'tpope/vim-surround'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'vim-airline/vim-airline-themes'
Plug 'vim-airline/vim-airline'

call plug#end()

set laststatus=2
set t_Co=256

let g:ctrlp_custom_ignore = '\v[\/](node_modules|\.git)$'
let g:ctrlp_working_path_mode = 'a'
let g:airline#extensions#tabline#enabled = 1
let g:airline_theme='jellybeans'

