import React, { FunctionComponent, useContext, useEffect } from 'react'
import { Grid, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { useSnackbar } from 'notistack'

import { IconButton, Link } from '@ui/index'
import { logoutUser } from '@utils/auth'
import { AppContext } from '@providers/AppProvider'
import { ILayoutProps } from '@interfaces/layouts'
import { errorMessage } from '@hooks/auth/errorMessage'

import { useStyles } from './GeneralLayout.styles'

import { ThemeContext } from '@providers/ThemeProvider'

import * as ThemeActions from '@actions/theme'
import clsx from 'clsx'
import Footer from '@components/main/Footer'
import { useQuery } from '@apollo/client'
import ME from '@graphql/queries/Me'
import * as ACTIONS from '@actions/auth'
import { useRouter } from 'next/router'

const GeneralLayout: FunctionComponent<ILayoutProps> = ({ children }) => {
  const { state, dispatch } = useContext(AppContext)
  const { dispatch: themeDispatch, state: themeState } = useContext(
    ThemeContext
  )
  const { isAuthenticated } = state
  const { enqueueSnackbar } = useSnackbar()
  const { data, loading, error } = useQuery(ME)
  const router = useRouter()

  useEffect(() => {
    if (!loading && data) {
      dispatch(ACTIONS.authSuccess({ user: { ...data.me, ...data.self } }))
    }
    if (error) logoutUser(dispatch)
  }, [data, loading])

  const classes = useStyles()

  const logout = async () => {
    try {
      await logoutUser(dispatch)
      enqueueSnackbar('Вы успешно вышли', {
        variant: 'success',
      })
      await router.push('/signin')
    } catch (error) {
      enqueueSnackbar(errorMessage(error), {
        variant: 'error',
      })
    }
  }

  const swapTheme = async () => {
    const t = themeState?.theme?.name === 'Light Theme' ? 'Dark' : 'Light'
    await themeDispatch(ThemeActions.changeTheme(t))
  }

  const theme = useTheme()
  const isSmallWidth = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <header className={classes.header}>
        <Grid
          container
          justify={'space-between'}
          spacing={isSmallWidth ? 2 : 1}
          alignItems={'center'}
          direction={isSmallWidth ? 'column' : 'row'}
        >
          <Grid item>
            <Link href={'/'} style={{ border: 'none' }}>
              <img
                src={'/images/foodMarket.png'}
                alt="FoodMarket"
                className={classes.logo}
              />
            </Link>
          </Grid>
          <Grid item>
            <Grid
              container
              justify={isSmallWidth ? 'flex-start' : 'space-between'}
              alignItems={'center'}
              spacing={1}
            >
              {isAuthenticated ? (
                <>
                  <Grid item>
                    <Link href={'/'} className={classes.link}>
                      Главная
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/shop'} className={classes.link}>
                      Магазин
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/my-account?panel=0'} className={classes.link}>
                      Мой аккаунт
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/my-account?panel=1'} className={classes.link}>
                      Корзина
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/my-account?panel=3'} className={classes.link}>
                      Избранное
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/about-us'} className={classes.link}>
                      О нас
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/contacts'} className={classes.link}>
                      Контакты
                    </Link>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item>
                    <Link href={'/'} className={classes.link}>
                      Главная
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/shop'} className={classes.link}>
                      Магазин
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/about-us'} className={classes.link}>
                      О нас
                    </Link>
                  </Grid>
                  <Grid item>·</Grid>
                  <Grid item>
                    <Link href={'/contacts'} className={classes.link}>
                      Контакты
                    </Link>
                  </Grid>
                </>
              )}
              <Grid item>
                <IconButton
                  icon={
                    themeState?.theme?.name == 'Light Theme' ? 'moon' : 'sun'
                  }
                  onClick={swapTheme}
                  className={clsx(
                    classes.themeIcon,
                    themeState?.theme?.name == 'Light Theme'
                      ? classes.moon
                      : classes.sun
                  )}
                />
              </Grid>
              <Grid item>
                {isAuthenticated ? (
                  <span
                    className={classes.linkStyle}
                    onClick={async () => await logout()}
                  >
                    Выход
                  </span>
                ) : (
                  <Grid container spacing={1} alignItems={'center'}>
                    <Grid item>
                      <Link href={'/signup'} className={classes.link}>
                        Регистрация
                      </Link>
                    </Grid>
                    <Grid item>/</Grid>
                    <Grid item>
                      <Link href={'/signin'} className={classes.link}>
                        Вход
                      </Link>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </header>
      <main className={classes.root}>{children}</main>
      <footer className={classes.footer}>
        <Footer />
        <Typography
          variant={'body1'}
          align={'center'}
          className={classes.copyright}
        >
          &#169; 2021 FoodMarket
        </Typography>
      </footer>
    </>
  )
}

export default GeneralLayout
