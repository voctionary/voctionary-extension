import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import qs from 'qs';
import {
    InputAdornment,
    FormControl,
    Stack,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Grid,
    Typography,
    Button,
    IconButton,
    OutlinedInput,
    Box,
    Divider
} from '@mui/material/';
import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material/';
import styled from 'styled-components';

export const NavLogo = styled(Typography)`
  color: #01bf71;
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    transition: 0.2s ease-in-out;
    transform: scale(1.5);
  }
`;

const MyButton = styled(Button)`
    && {
      border-radius: 50px;
      background: #01bf71;
      padding: 2px 4px;
      color: white;
      font-size: 12px;
      border: 2px solid #01bf71;
  
      &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color:  #01bf71;
      }
    }
  `;

const MyFormControl = styled(FormControl)`
    label {
      color: #bbb;
    }
    .MuiOutlinedInput-root {
      fieldset {
        border-color: #bbb;
      }
      &:hover fieldset {
        border-color: #01bf71;
      }
      &:focus-within fieldset {
        border-color: #01bf71;
      }
    }
    &:hover label {
      color: #01bf71;
    }
    &:focus-within label {
      color: #01bf71;
    }
  
    .MuiIconButton-root {
      color: #bbb;
      &:hover {
        color: #01bf71;
        background-color: transparent;
      }
      &:focus {
        color: #01bf71;
        background-color: transparent;
      }
    }
  `;

const SearchStack = styled(Stack)`
    max-width: 500px;
    margin: 0 auto;
    position: relative;
    background: white;
`;

const SearchForm = styled.form`
`;

const SearchFormStack = styled(Stack)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 10px;
`;

const LanguageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px auto 5px auto;
`;

const Language = styled(FormControl)`
    & label {
        color: #777;
        transition: none;
    }
    &:hover {
        & label {
            color: #01bf71;
        }
    }
    & label.Mui-focused {
        color: #01bf71;
    }

    & .MuiOutlinedInput-root {
        color: #777;
        & fieldset {
            border-color: #777;
        }
        & svg {
            color: #777;
        }

        &:hover{
            color: #01bf71;
            & fieldset {
                border-color: #01bf71;
            }
            & svg {
                color: #01bf71;
            }
        }

        &.Mui-focused {
            color: #01bf71;
        }
        &.Mui-focused fieldset {
            border-color: #01bf71;
        }
        &.Mui-focused svg {
            color: #01bf71;
        }
    }
`;

const LanguageLabel = styled(InputLabel)`
`;

const LanguageSelect = styled(Select)`
    min-width: 150px;
`;

const LanguageSelectItem = styled(MenuItem)`
`;

const WordWrapper = styled.div`
    margin: 5px 10px 0 10px;
`;

const Word = styled(TextField)`
    transition: 1s ease-in-out;

    & label {
        color: #777;
        transition: none;
    }
    &:hover {
        & label {
            color: #01bf71;
        }
    }
    & label.Mui-focused {
        color: #01bf71;
    }

    & .MuiOutlinedInput-root {
        & fieldset {
            border-color: #777;
        }
        & input {
            color: #777;
        }
        & svg {
            color: #777;
        }

        &:hover{
            & fieldset {
                border-color: #01bf71;
            }
            & input {
                color: #01bf71;
            }
            & svg {
                color: #01bf71;
            }
        }

        &.Mui-focused fieldset {
            border-color: #01bf71;
        }
        &.Mui-focused input {
            color: #01bf71;
        }
        &.Mui-focused svg {
            color: #01bf71;
        }
    }

`;

const Autocomplete = styled.div`
    max-width: 410px;
    max-height: 280px;
    margin: 0 auto;
    background: #eee;
    border-radius: 10px;
`;

const AutocompleteTypography = styled(Typography)`
    color: black;
`;

const AutocompleteItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    padding: 8px 0px;
    max-width: 410px;

    &:hover{
        background: #505050;
        border-radius: 10px;

        ${AutocompleteTypography}{
            color: white;
        }
    }
`;

const Btn = styled.button`
  border-radius: 50px;
  background: #01bf71;
  white-space: nowrap;
  padding: 4px 8px;
  color: white;
  font-size: 13px;
  outline: none;
  border: 2px solid #01bf71;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;


  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #01bf71;
  }
`;

function Popup() {
    const SERVER_URL = "http://localhost:8080";
    const CLIENT_URL = "http://localhost:3000/voctionary-react#";

    var email = undefined;
    var password = undefined;

    const [showPassword, setShowPassword] = useState(false);
    const [languageFrom, setLanguageFrom] = useState(undefined);
    const [languageTo, setLanguageTo] = useState(undefined);
    const [text, setText] = useState(undefined);
    const [words, setWords] = useState(undefined);
    const [word, setWord] = useState(undefined);
    const [isAuthorized, setIsAuthorized] = useState(undefined);
    const [userInfo, setUserInfo] = useState(undefined);
    const [languagesFrom, setLanguagesFrom] = useState(undefined);
    const [languagesTo, setLanguagesTo] = useState(undefined);
    const [isReady, setIsReady] = useState(undefined);
    const [wrongInput, setWrongInput] = useState(false);
    const [error, setError] = useState(undefined);

    //api requests
    const fetchUserInfo = () => {
        axios.get(SERVER_URL + "/api/getUserInfo", { withCredentials: true }).then(res => {
            if (res.data) {
                setUserInfo(res.data);
                setIsAuthorized(true);
            }
            else {
                setUserInfo(undefined);
                setIsAuthorized(false);
            }
        })
            .catch(error => {
                if (error.response.status === 401) {
                    setUserInfo(undefined);
                    setIsAuthorized(false);
                }
                else {
                    setError(error.message);
                }
            });
    };

    const fetchLanguages = () => {
        axios.get(SERVER_URL + "/api/languages", { withCredentials: true })
            .then((res) => {
                if (res.data.from && res.data.to) {
                    setLanguagesFrom(res.data.from);
                    setLanguagesTo(res.data.to);

                    chrome.storage.local.get(['languageFrom'], function (result) {
                        if (result.languageFrom) {
                            setLanguageFrom(result.languageFrom);
                        }
                        else {
                            setLanguageFrom(res.data.to[0]);
                        }
                    });
                    chrome.storage.local.get(['languageTo'], function (result) {
                        if (result.languageFrom) {
                            setLanguageTo(result.languageTo);
                        }
                        else {
                            setLanguageTo(res.data.to[0]);
                        }
                    });

                    chrome.storage.local.get(['text'], function (result) {
                        if (result.text) {
                            setText(result.text);
                        }
                    });
                }
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const findWord = (textParam = text, language = languageFrom) => {
        chrome.storage.local.set({ 'text': textParam });
        textParam = textParam ? textParam.trim() : undefined;
        if (textParam && language) {
            axios.get(SERVER_URL + "/api/findWord", { params: { language: language.key, word: textParam }, withCredentials: true }).then(res => {
                if (res.data.length === 0) {
                    setWords(undefined);
                }
                else {
                    setWords(res.data);
                }
            })
                .catch(error => {
                    setError(error.message);
                });
        }
        else {
            setWords(undefined);
        }
    };

    const postRequest = () => {
        var data = qs.stringify({
            'email': email,
            'password': password,
            'rememberMe': true
        });
        var config = {
            method: 'post',
            url: SERVER_URL + '/api/logIn',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            withCredentials: true,
        };
        axios(config)
            .then(res => {
                fetchUserInfo();
                findWord();
            })
            .catch(error => {
                if (error.response.status === 401) {
                    setWrongInput(true);
                }
                else {
                    setError(error.message);
                }
            });
    };

    const addWordToList = async (wordId) => {
        await axios.post(SERVER_URL + "/api/addWordToList", new URLSearchParams({ wordId: wordId }), { withCredentials: true }).then(res => {
        }).catch(error => {
            setError(error.message);
        });
    };

    const removeWordFromList = async (wordId) => {
        await axios.delete(SERVER_URL + "/api/removeWordFromList", { params: { wordId: wordId }, withCredentials: true }).then(res => {
        }).catch(error => {
            setError(error.message);
        });
    };


    //handlers
    const handleOnChangeLanguageFrom = (event) => {
        setLanguageFrom(event.target.value);
        if (text) {
            setWord(undefined);
            findWord(text, event.target.value);
        }
    };

    const handleOnChangeLanguageTo = (event) => {
        setLanguageTo(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    const handleOnChangeText = (event) => {
        setText(event.target.value);
    };

    const handleOpen = (event, wordId) => {
        chrome.tabs.create({ url: CLIENT_URL + "/word/" + wordId });
    };

    const handleAdd = async (event, wordId) => {
        await addWordToList(wordId);
        findWord();
    }

    const handleRemove = async (event, wordId) => {
        await removeWordFromList(wordId);
        findWord();
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => { event.preventDefault() };

    const handleSignIn = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        email = data.get('email');
        if (!email) {
            setWrongInput(true);
            return;
        }
        if (!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
            setWrongInput(true);
            return;
        }
        password = data.get('password');
        if (!password) {
            setWrongInput(true);
            return;
        }
        postRequest();
    };

    const handleProfile = () => {
        chrome.tabs.create({ url: CLIENT_URL + "/profile" });
    }

    const handleLogo = () => {
        chrome.tabs.create({ url: CLIENT_URL });
    }

    //useEffects
    useEffect(() => {
        fetchLanguages();
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            findWord(text);
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [text]);

    useEffect(() => {
        if (wrongInput) {
            setTimeout(() => {
                setWrongInput(false);
            }, 1000);
        }
    }, [wrongInput]);

    useEffect(() => {
        if (languagesFrom && languagesTo && languageFrom && languageTo) {
            setIsReady(true);
            chrome.storage.local.set({ 'languagesFrom': languagesFrom });
            chrome.storage.local.set({ 'languagesTo': languagesTo });
            chrome.storage.local.set({ 'languageFrom': languageFrom });
            chrome.storage.local.set({ 'languageTo': languageTo });
        }
    }, [languagesFrom, languagesTo, languageFrom, languageTo]);

    return (
        <>
            {error ?
                <>
                    <Typography>{' Error response from server ' + SERVER_URL + ' : ' + error}</Typography>
                </>
                :
                <>
                    {!isReady ? ''
                        :
                        <>
                            {isAuthorized ?
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <NavLogo onClick={handleLogo} sx={{ fontSize: '18px', fontWeight: "bold" }}>Voctionary</NavLogo>
                                    </Box>
                                    <Divider sx={{ marginTop: 1, height: 2 }} />
                                    <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box component="form" noValidate onSubmit={handleProfile} sx={{ width: '400px', mt: 1 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={10} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                                    <Typography>{userInfo.name + " " + userInfo.surname}</Typography>
                                                </Grid>
                                                <Grid item xs={2} sx={{ display: 'flex' }}>
                                                    <FormControl fullWidth sx={{ justifyContent: 'center' }}>
                                                        <MyButton type="submit">Profile</MyButton>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box>
                                :
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <NavLogo onClick={handleLogo} sx={{ fontSize: '18px', fontWeight: "bold" }}>Voctionary</NavLogo>
                                    </Box>
                                    <Divider sx={{ marginTop: 1, height: 2 }} />
                                    <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box component="form" noValidate onSubmit={handleSignIn} sx={{ width: '400px', mt: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={5}>
                                                    <MyFormControl fullWidth error={wrongInput}>
                                                        <InputLabel sx={{ fontSize: '0.9rem' }}>Email Address</InputLabel>
                                                        <OutlinedInput id="email" name="email" label="Email Address" sx={{ fontSize: '0.9rem' }} />
                                                    </MyFormControl>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <MyFormControl fullWidth error={wrongInput}>
                                                        <InputLabel sx={{ fontSize: '0.9rem' }}>Password</InputLabel>
                                                        <OutlinedInput id="password" name="password" label="Password" type={showPassword ? 'text' : 'password'} sx={{ fontSize: '0.9rem' }}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </MyFormControl>
                                                </Grid>
                                                <Grid item xs={2} sx={{ display: 'flex' }}>
                                                    <FormControl fullWidth sx={{ justifyContent: 'center' }}>
                                                        <MyButton type="submit">Sign In</MyButton>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Box>
                            }
                            <Divider sx={{ marginTop: 2, height: 2 }} />
                            <SearchStack spacing={0} >
                                <SearchForm onSubmit={handleSubmit}>
                                    <SearchFormStack spacing={0}>
                                        <LanguageWrapper>
                                            <Language sx={{ margin: '10px' }}>
                                                <LanguageLabel id="language-from-label">Language From</LanguageLabel>
                                                <LanguageSelect labelId="language-from-label" id="language-from" value={languageFrom} label="Language From" onChange={handleOnChangeLanguageFrom} renderValue={(value) => `${value.title}`}>
                                                    {languagesFrom.map(language => (
                                                        <LanguageSelectItem key={language.id} value={language}>{language.title}</LanguageSelectItem>
                                                    ))}
                                                </LanguageSelect>
                                            </Language>
                                            {
                                                languagesTo.length < 1 ? ''
                                                    :
                                                    <Language >
                                                        <LanguageLabel id="language-from-to">Language To</LanguageLabel>
                                                        <LanguageSelect labelId="language-from-to" id="language-to" value={languageTo} label="Language To" onChange={handleOnChangeLanguageTo} renderValue={(value) => `${value.title}`}>
                                                            {languagesTo.map(language => (
                                                                <LanguageSelectItem key={language.id} value={language}>{language.title}</LanguageSelectItem>
                                                            ))}
                                                        </LanguageSelect>
                                                    </Language>
                                            }
                                        </LanguageWrapper>
                                        <WordWrapper>
                                            <Word sx={{ minWidth: '410px' }} id="outlined-textarea" label="Search" placeholder="Start typing to look up a word" value={text} onChange={handleOnChangeText} onKeyDown={handleKeyDown} autoFocus
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon sx={{ fontSize: '1.8rem' }} />
                                                        </InputAdornment>
                                                    ), style: { fontSize: '1.4rem' }
                                                }} InputLabelProps={{ style: { fontSize: '1.4rem' } }} />
                                        </WordWrapper>
                                    </SearchFormStack>
                                </SearchForm>
                            </SearchStack>

                            {words === undefined ? '' :
                                <Autocomplete sx={{ marginBottom: 3 }}>
                                    {words.map(w => (
                                        <AutocompleteItem key={w.id} onMouseDown={() => getWordById(w.id)} >
                                            <Box sx={{ marginLeft: '13px' }}>
                                                <AutocompleteTypography sx={{ display: 'inline', fontWeight: 'bold', fontSize: '1.1rem', marginRight: '6px' }} component="h2" variant="body2">{w.headwords === undefined ? '' : w.headwords.map((h, i) => (i === 0 ? h.text : ', ' + h.text))}</AutocompleteTypography>
                                                <AutocompleteTypography sx={{ display: 'inline', fontStyle: 'italic', fontSize: '1rem', marginLeft: '6px' }} component="h3" variant="body2">{w.headwords === undefined ? '' : w.partOfSpeech}</AutocompleteTypography>
                                            </Box>
                                            <Box sx={{ marginRight: '13px' }}>
                                                {isAuthorized ?
                                                    <>
                                                        <Box sx={{ display: 'inline', marginRight: '10px' }}>
                                                            <MyButton onClick={(event) => handleOpen(event, w.id)}>Open</MyButton>
                                                        </Box>
                                                        <Box sx={{ display: 'inline' }}>
                                                            {w.isListed ?
                                                                <MyButton onClick={(event) => handleRemove(event, w.id)}>Remove</MyButton>
                                                                :
                                                                <MyButton onClick={(event) => handleAdd(event, w.id)}>Add</MyButton>
                                                            }
                                                        </Box>
                                                    </>
                                                    :
                                                    <>
                                                        <Box sx={{ display: 'inline', marginRight: '10px' }}>
                                                            <MyButton onClick={(event) => handleOpen(event, w.id)}>Open</MyButton>
                                                        </Box>
                                                    </>
                                                }
                                            </Box>
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            }
                            <Box sx={{ marginBottom: 3 }} />
                        </>
                    }
                </>
            }
        </>
    );
}

const container = document.getElementById('react-target');
const root = createRoot(container);
root.render(<Popup />);