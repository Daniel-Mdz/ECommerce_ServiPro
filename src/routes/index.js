import { Router } from "express"
const router = Router()

router.get('/', (req, res) => res.render('index',{title: 'ServiPro - Los mejores servicios'}))
router.get('/about', (req, res) => res.render('about', {title: 'ServiPro - Sobre nosotros'}))
router.get('/contact', (req, res) => res.render('contact', {title: 'ServiPro - Contáctanos'}))

export default router