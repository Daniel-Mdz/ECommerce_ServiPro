import { Router } from "express"
const router = Router()

router.get('/', (req, res) => res.render('index',{title: 'ServiPro - Los mejores servicios'}))
router.get('/about', (req, res) => res.render('about', {title: 'ServiPro - Sobre nosotros'}))
router.get('/contact', (req, res) => res.render('contact', {title: 'ServiPro - Contáctanos'}))
router.get('/login', (req, res) => res.render('login', {title: 'ServiPro - Login'}))
router.get('/register', (req, res) => res.render('register', {title: 'ServiPro - Registrate'}))
router.get('/contratar', (req, res) => res.render('contratar', {title: 'ServiPro - Servicios Disponibles'}))
router.get('/ofrecer', (req, res) => res.render('ofrecer', {title: 'ServiPro - Ofrecer Servicios'}))

export default router